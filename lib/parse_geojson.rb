require 'rubygems'
require "json"
require "rsolr"
#http://www.johnhawthorn.com/2009/10/sanitizing-utf8-in-ruby/
UTF8_REGEX = /\A(
       [\x09\x0A\x0D\x20-\x7E]            # ASCII
     | [\xC2-\xDF][\x80-\xBF]             # non-overlong 2-byte
     |  \xE0[\xA0-\xBF][\x80-\xBF]        # excluding overlongs
     | [\xE1-\xEC\xEE][\x80-\xBF]{2}      # straight 3-byte
     |  \xEF[\x80-\xBE]{2}                # 
     |  \xEF\xBF[\x80-\xBD]               # excluding U+fffe and U+ffff
     |  \xED[\x80-\x9F][\x80-\xBF]        # excluding surrogates
     |  \xF0[\x90-\xBF][\x80-\xBF]{2}     # planes 1-3
     | [\xF1-\xF3][\x80-\xBF]{3}          # planes 4-15
     |  \xF4[\x80-\x8F][\x80-\xBF]{2}     # plane 16
   )*\Z/nx;


def sanitize_filename(filename)
  filename = filename.gsub(/\d+/, '').gsub("_",'').gsub(" ","")
  fn = filename.split /(?=[A-Z])/
  return fn.join ''
end

def get_name geojson
	name =  geojson['properties']['DENOMINAZ'] || 
			geojson['properties']['Nome'] || 
			geojson['properties']['nome'] || 
			geojson['properties']['NOME'] || 
			geojson['properties']['SEDE'] || 
			geojson['properties']['BIKE_SH'] || 
			geojson['properties']['AREA_SOSTA'] ||
			geojson['properties']['FERMATA'] ||
			geojson['properties']['LINEA'].to_i.to_s
	puts geojson if name.nil?
	name.split(//u).grep(UTF8_REGEX).join
end

def get_address geojson
	address = 	geojson['properties']['INDIRIZZO'] || 
				geojson['properties']['Indirizzo'] || 
				geojson['properties']['NOME_VIA'] || 
				geojson['properties']['LOCALIZ'] || 
				geojson['properties']['Nome'] || 
				geojson['properties']['LINEA'].to_i.to_s
	address.split(//u).grep(UTF8_REGEX).join
end

def get_category(geojson,resource_type)
	category = geojson['properties']['CATEGORIA'] || geojson['properties']['info'] || geojson['properties']['TIPOLOGIA']  
	if category.nil?
		category = resource_type
	end
	category.split(//u).grep(UTF8_REGEX).join
end

def get_zone geojson
	zone = geojson['properties']['ZONA'] || geojson['properties']['Zona'] || ""
end

def get_coordinate geojson
	coordinates =  geojson['geometry']['coordinates'] if geojson['geometry']['type'] == 'Point'
	return "" if coordinates.nil?
	lat = coordinates[0].to_f
	lon = coordinates[1].to_f
	if(lat.between?(-90,90) && lon.between?(-180,180))
		"#{coordinates[0]},#{coordinates[1]}"
	else
		return ''
	end
end

def get_line_string geojson
	coordinates =  geojson['geometry']['coordinates'] if geojson['geometry']['type'] == 'LineString'
	if coordinates.nil? 
		return ""
	else
		line_string = "LINESTRING(#{ coordinates[0..-2].map{|geo| geo[0].to_s + ' ' + geo[1].to_s + ',' } } #{coordinates.last[0].to_s} #{coordinates.last[1].to_s})"
		
	end
	
end

empty = "empty"


i = 0
data_items = Array.new
data = File.open("data.json",'w')

Dir.glob("E:/github/appMI/geojson_data/**.geojson").each do |file|
	resource_type = sanitize_filename(File.basename(file, ".geojson"))
	puts "Resource type: #{resource_type}"
	file = File.open(file,'r').read
	#puts file
	json = JSON.parse(file)
	
	json['features'].each do |item|
		
		coordinates =  item['geometry']['coordinates'] if item['geometry']['type'] == 'Point'
		#puts "#{coordinates[0]},#{coordinates[1]}"
		#puts item['properties']['DENOMINAZ']
		#puts get_category(item,resource_type)
		data_items << {
			:id => i,
			:place => get_coordinate(item),
			:name => get_name(item).nil? ? empty : get_name(item),
			:address => get_address(item).nil? ? empty : get_address(item),
			:category => get_category(item,resource_type).nil? ? empty : get_category(item,resource_type),
			:zone => get_zone(item).nil? ? empty : get_zone(item),
			:line_string => get_line_string(item).nil? ? empty : get_line_string(item)
		}

		puts "ERROR NAME #{resource_type}" if get_name(item).nil?
		puts "ERROR ADDRESS #{resource_type}" if get_address(item).nil?
		puts "ERROR CATEGORY #{resource_type}" if get_category(item,resource_type).nil?
		puts "ERROR ZONE #{resource_type}" if get_zone(item).nil?
		i += 1
	end
	
end

data.write(data_items.to_json)

solr_testing = RSolr.connect(:read_timeout => 120, :open_timeout => 120, :url => "http://localhost:8080/solr2/collection1") #"http://geoportal-dev.ies.jrc.it:8090/solr"



solr_testing_response = solr_testing.get 'select', :params => {:q  => '*:*', :start => 2, :rows => 10000}
solr_testing_response["response"]["docs"].each do |document|
  solr_testing.delete_by_query ["id:#{document['id']}"]
  solr_testing.commit
end

solr_testing.add data_items
solr_testing.commit
