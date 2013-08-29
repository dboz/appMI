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

def get_name(geojson, resource_type)
	if resource_type == "Ciclabili"
		return "Pista ciclabile: #{ geojson['properties']['NOME_VIA']}"
	end

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

def get_cap geojson
	cap = 	geojson['properties']['CAP'].to_i
	cap == 0 ? "" : cap.to_s
end

def get_url geojson
	url = 	geojson['properties']['URL'] || geojson['properties']['WWW'] || geojson['properties']['www']
end

def get_email geojson
	email = geojson['properties']['EMAIL'] || geojson['properties']['E_MAIL'] || geojson['properties']['E_MAIL_GES'] || geojson['properties']['MAIL']
end

def get_telephone geojson
	telephone = geojson['properties']['TEL'] || geojson['properties']['TELEFONO'] || geojson['properties']['TELEFONO1'] || geojson['properties']['TEL_SEGR']
end

def get_fax geojson
	geojson['properties']['FAX'].to_s
end

def get_category(geojson,resource_type)
	category = geojson['properties']['CATEGORIA'] || geojson['properties']['info'] || geojson['properties']['TIPOLOGIA']  
	if category.nil?
		category = resource_type
	end
	unless geojson['properties']['BIKE_SH'].nil?
		return "Trasporti"
	end
	return "Traffico" if resource_type == "Car"
	if resource_type == "Ciclabili"
		return "Traffico"
	end
	return "Trasporti" if resource_type == "FerrovieStazioniMilano"
	return "Sport" if resource_type == "ImpiantiSportivi"
	return "Trasporti" if resource_type == "ParkInterscambio"
	return "Sport" if resource_type == "Piscine"
	

	category.split(//u).grep(UTF8_REGEX).join
end

def get_sub_category(geojson,resource_type)
	unless geojson['properties']['BIKE_SH'].nil?
		return ["Traporti","Bicicletta","Sport"]
	end
	unless geojson['properties']['AREA_SOSTA'].nil?
		return ["Traporti","AreaSosta","Traffico", "Parcheggio"]
	end
	sub_category = Array.new
	sub_category << geojson['properties']['SOTTOTIPO'] unless geojson['properties']['SOTTOTIPO'].nil?
	sub_category << geojson['properties']['ORD_REGOLA'] unless geojson['properties']['ORD_REGOLA'].nil?
	sub_category << "Stazione Ferroviaria" if resource_type == "FerrovieStazioniMilano"
	sub_category << geojson['properties']['info'] unless geojson['properties']['info'].nil?
	sub_category << geojson['properties']['AATTIVITA_'] unless geojson['properties']['AATTIVITA_'].nil?
	sub_category << "Parcheggio" if resource_type == "ParkInterscambio"
	sub_category << "AreaSosta" if resource_type == "ParkInterscambio"
	
	sub_category
end

def get_zone geojson
	zone = geojson['properties']['ZONA'] || geojson['properties']['Zona']
	if zone.nil?
		return ""
	else
		zone.to_i.to_s
	end
end

def get_description geojson
	description = Array.new
	description << geojson['properties']['AMBITO'].split(//u).grep(UTF8_REGEX).join unless geojson['properties']['AMBITO'].nil?
	description << "Ente #{geojson['properties']['ENTE'].split(//u).grep(UTF8_REGEX).join}" unless geojson['properties']['ENTE'].nil?
	description << geojson['properties']['INFO'].split(//u).grep(UTF8_REGEX).join unless geojson['properties']['INFO'].nil?
	description << "Stalli: #{geojson['properties']['STALLI']}" unless geojson['properties']['STALLI'].nil?
	description << "Dove si trova: #{geojson['properties']['LOCALIZ'].split(//u).grep(UTF8_REGEX).join}" unless geojson['properties']['LOCALIZ'].nil?
	description << "Anno: #{geojson['properties']['ANNO']}" unless geojson['properties']['ANNO'].nil?
	description << "Comune: #{geojson['properties']['COMUNE'] }" unless geojson['properties']['COMUNE'].nil?
	description << "Posti auto: #{geojson['properties']['POSTI_AUTO'].to_i}" unless geojson['properties']['POSTI_AUTO'].nil?
	description << "Gestore: #{geojson['properties']['GESTORE'].split(//u).grep(UTF8_REGEX).join}" unless geojson['properties']['GESTORE'].nil?
	description << "Gestore: #{geojson['properties']['gestore'].split(//u).grep(UTF8_REGEX).join}" unless geojson['properties']['gestore'].nil?
	description << "Gestore: #{geojson['properties']['TIPOLOGIA'].split(//u).grep(UTF8_REGEX).join}" unless geojson['properties']['TIPOLOGIA'].nil?
	description << "#{geojson['properties']['SERVICES']}" unless geojson['properties']['SERVICES'].nil?
	description << "Camere: #{geojson['properties']['CAMERE'].to_i}" unless geojson['properties']['CAMERE'].nil?
	description << "Capienza: #{geojson['properties']['CAPIENZA']}" unless geojson['properties']['CAPIENZA'].nil?

	description << "Capienza: #{geojson['properties']['TAB1']}" unless geojson['properties']['TAB1'].nil?
	description << "Corrispondenza: #{geojson['properties']['CORRISPONDENZA']}" unless geojson['properties']['CORRISPONDENZA'].nil?
	description << "Proprietà: #{geojson['properties']['PROPRIETA']}" unless geojson['properties']['PROPRIETA'].nil?

	 
	
	return description
end

def get_disabled_peaple geojson
	disabled_peaple = geojson['properties']['DISABILI']
end

def get_coordinate geojson
	coordinates =  geojson['geometry']['coordinates'] if geojson['geometry']['type'] == 'Point'
	return "" if coordinates.nil?
	lat = coordinates[1].to_f
	lon = coordinates[0].to_f
	if(lat.between?(-90,90) && lon.between?(-180,180))
		"#{lat},#{lon}"
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



empty = ""


i = 0
data_items = Array.new
data = File.open("data.json",'w')

Dir.glob("E:/github/appMI/geojson_data/**.geojson").each do |file|
	resource_type = sanitize_filename(File.basename(file, ".geojson"))
	puts "Resource type: #{resource_type}"
	file = File.open(file,'r').read
	json = JSON.parse(file)
	
	json['features'].each do |item|

		data_items << {
			:id => i,
			:place => get_coordinate(item),
			:name => get_name(item,resource_type).nil? ? empty : get_name(item,resource_type),
			:address => get_address(item).nil? ? empty : get_address(item),
			:category => get_category(item,resource_type).nil? ? empty : get_category(item,resource_type),
			:sub_category => get_sub_category(item,resource_type).nil? ? empty : get_sub_category(item,resource_type),
			:zone => get_zone(item).nil? ? empty : get_zone(item),
			:line_string => get_line_string(item).nil? ? empty : get_line_string(item),
			:cap => get_cap(item).nil? ? empty : get_cap(item),
			:url => get_url(item).nil? ? empty : get_url(item),
			:email => get_email(item).nil? ? empty : get_email(item),
			:telephone => get_telephone(item).nil? ? empty : get_telephone(item),
			:fax => get_fax(item).nil? ? empty : get_fax(item),
			:description => get_description(item).nil? ? empty : get_description(item),
			:disabled_peaple => get_disabled_peaple(item).nil? ? empty : get_disabled_peaple(item)
		}

		puts "ERROR NAME #{resource_type}" if get_name(item,resource_type).nil?
		puts "ERROR ADDRESS #{resource_type}" if get_address(item).nil?
		puts "ERROR CATEGORY #{resource_type}" if get_category(item,resource_type).nil?
		puts "ERROR ZONE #{resource_type}" if get_zone(item).nil?
		i += 1
	end
	
end

data.write(data_items.to_json)
data.close
