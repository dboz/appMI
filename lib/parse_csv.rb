require 'rubygems'
require 'csv'
require 'json'
require 'dbf'

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


table = DBF::Table.new("E:/github/appMI/csv_data/ServiziAllaPersona.dbf")
columns = Array.new
table.columns.each do |column|
	columns << column.name
end

table.each do |row|
	element =  {}
	element['address'] = row['UBICAZIONE'].split(';')[0]
	element['name'] = row['TIPO_ESER_']
	element['zone'] = row['ZD'].to_i.to_s
	element['category'] = "service_to_individuals"
	element['id'] = i
	data_items << element
	i += 1
end


table = DBF::Table.new("E:/github/appMI/csv_data/siti_openwifi2.dbf")
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
	element['place'] = "#{row['LATITUDINE']},#{row['LONGITUDIN']}"
	element['id'] = i
	data_items << element
	i += 1
end


data.write(data_items.to_json)


	







data.close