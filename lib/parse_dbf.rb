require 'rubygems'
require 'csv'
require 'json'
require 'dbf'
require 'open-uri'


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

i = 0
data_items = Array.new
data = File.open("data2.json",'w')

=begin
table = DBF::Table.new("E:/github/appMI/dbf_data/ServiziAllaPersona.dbf")
columns = Array.new
table.columns.each do |column|
	columns << column.name
end

table.each do |row|
	element =  {}
	element['address'] = row['UBICAZIONE'].split(';')[0]
	element['name'] = row['TIPO_ESER_'].split(';')[0]
	element['zone'] = row['ZD'].to_i.to_s
	element['category'] = "ServizioPubblico"
	element['sub_category'] = "ServizioAllaPersona"
	element['description'] = row['TIPO_ESER_'].split(';')
	element['id'] = i
	data_items << element
	i += 1
end


table = DBF::Table.new("E:/github/appMI/dbf_data/siti_openwifi2.dbf")
columns = Array.new
table.columns.each do |column|
	columns << column.name
end

table.each do |row|
	element =  {}
	element['address'] = row['SITO'].split(';')[0]
	element['name'] = 'Wi-Fi ' + row['CODICE']
	element['zone'] = row['ZONA']
	element['category'] = "Wi-Fi"
	element['place'] = "#{row['LATITUDINE'].to_f},#{row['LONGITUDIN'].to_f}"
	element['id'] = i
	data_items << element
	i += 1
end


table = DBF::Table.new("E:/github/appMI/dbf_data/SomministrazioneFuoriPiano.dbf")
columns = Array.new
table.columns.each do |column|
	columns << column.name
end

table.each do |row|
	element =  {}
	element['address'] = row['UBICAZIONE'].split(';')[0]
	element['name'] = row['INSEGNA'] || 'Servizio pubblico'
	element['zone'] = row['ZD'].to_i.to_s
	element['category'] = "ServizioPubblico"
	element['sub_category'] = "SomministrazioneFuoriPiano"
	element['description'] = ["Forma commerciale: #{row['FORMA_COMM']}","Forma vendita: #{row['FORMA_VEND']}" ]
	element['id'] = i
	data_items << element
	i += 1
end

table = DBF::Table.new("E:/github/appMI/dbf_data/SomministrazioneInPiano.dbf")
columns = Array.new
table.columns.each do |column|
	columns << column.name
end

table.each do |row|
	element =  {}
	element['address'] = row['UBICAZIONE'].split(';')[0]
	element['name'] = row['TIPO_ESER_'] || 'Servizio pubblico'
	element['zone'] = row['ZD'].to_i.to_s
	element['category'] = "ServizioPubblico"
	element['sub_category'] = ["SomministrazioneInPiano"]
	element['description'] = ["Forma commerciale: #{row['FORMA_COMM']}","Forma vendita: #{row['FORMA_VEND']}", "#{row['SETTORE_ST']}"]
	element['id'] = i
	data_items << element
	i += 1
end
=end



table = DBF::Table.new("E:/github/appMI/dbf_data/StruttureAlberghiere.dbf")
columns = Array.new
table.columns.each do |column|
	columns << column.name
end

address_mapping = {
	"CSO" => 'Corso',
	"GLL" => 'Galleria',
	"LGO" => "Largo",
	"PLE" => 'Piazzale',
	"PZA" => 'Piazza',
	"VIA" => 'Via',
	"ALZ" => 'Via',
	"VLE" => 'Viale'
}

t = File.open('test_address','w')
table.each do |row|
	address = "#{address_mapping[row['TIPOVIA']] unless row['TIPOVIA'].nil? } #{row['DESCRIZION']}, #{row['CIVICO'].to_i}, Milan, Italy".split(' ').join('+')
	#address = "Milano #{row['UBICAZIONE']}".gsub('.','').gsub('/','').gsub(';','').split('(')[0].split(' ').join('+')
	#request = "http://maps.googleapis.com/maps/api/geocode/json?address=#{address}&sensor=false"
	request = "http://www.datasciencetoolkit.org/maps/api/geocode/json?sensor=false&address=#{address}"
	'http://www.datasciencetoolkit.org/maps/api/geocode/json?sensor=false&address=1600+Amphitheatre+Parkway,+Mountain+View,+CA'
	#puts address
	content = JSON.parse(open(request).read)
	
	begin
	lat =  content['results'][0]['geometry']['location']['lat']
	lon =  content['results'][0]['geometry']['location']['lng']
	#puts content.inspect
	rescue Exception => e
		#puts address
		#puts e.message
		puts 'ko'
		t.write(address)
		t.write(content.to_json)

	end
	
	
	puts "#{lat.to_f},#{lon.to_f}"
	element =  {}
	element['address'] = row['UBICAZIONE'].split(';')[0]
	element['name'] = row['INSEGNA'] || 'Servizio pubblico'
	element['zone'] = row['ZD'].to_i.to_s
	element['category'] = "ServizioPubblico"
	element['sub_category'] = ["StruttureAlberghiere", row['TIPO_ATT_']]
	element['description'] = ["Numero camere #{row['CAMERE']}", "Stelle: #{row['CATEGORIA']}"]
	element['id'] = i
	element['number_of_rooms'] = row['CAMERE'] unless row['CAMERE'].nil?
	element['number_of_stars'] = row['CATEGORIA'] unless row['CATEGORIA'].nil?
	data_items << element
	i += 1
	
end
	t.close
=begin

table = DBF::Table.new("E:/github/appMI/dbf_data/VenditaSedeFissa_EV.dbf")
columns = Array.new
table.columns.each do |column|
	columns << column.name
end

table.each do |row|
	element =  {}
	element['address'] = row['UBICAZIONE'].split(';')[0]
	element['name'] = row['INSEGNA'] || 'Piccola-Media attività commericale'
	element['zone'] = row['ZD'].to_i.to_s
	element['category'] = "ServizioPubblico"
	element['sub_category'] = ["AttivitaCommerciale"]
	element['description'] = ["Piccola-Media attività commericale", "#{row['SETTORE_ME']}", row['UBICAZIONE'] ]
	element['id'] = i
	data_items << element
	i += 1
end

table = DBF::Table.new("E:/github/appMI/dbf_data/VenditaSedeFissa_EV-MG.dbf")
columns = Array.new
table.columns.each do |column|
	columns << column.name
end

table.each do |row|
	element =  {}
	element['address'] = row['UBICAZIONE'].split(';')[0]
	element['name'] = row['INSEGNA'] || 'Grande attività commericale'
	element['zone'] = row['ZD'].to_i.to_s
	element['category'] = "ServizioPubblico"
	element['sub_category'] = ["AttivitaCommerciale"]
	element['description'] = ["Grande attività commericale", "#{row['SETTORE_ME']}" ]
	element['id'] = i
	data_items << element
	i += 1
end
=end
data.write(data_items.to_json)


	







data.close