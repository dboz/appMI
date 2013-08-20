require 'rubygems'
require 'csv'
require 'json'
require 'dbf'
require 'open-uri'
require 'geocoder'
require "./progressbar.rb"
require "./geocoding.rb"


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

$address_mapping = {
	"CSO" => 'Corso',
	"GLL" => 'Galleria',
	"LGO" => "Largo",
	"PLE" => 'Piazzale',
	"PZA" => 'Piazza',
	"VIA" => 'Via',
	"ALZ" => 'Via',
	"VLE" => 'Viale'
}


$geocoding = Geocoding.new

def __getLatLon(row)
	address = "#{$address_mapping[row['TIPOVIA']] unless row['TIPOVIA'].nil? } #{row['DESCRIZION']}, #{row['CIVICO'].to_i}, Milan, Italy".split(' ').join('+')
	request = "http://maps.googleapis.com/maps/api/geocode/json?address=#{address}&sensor=false"
	content = JSON.parse(open(request).read)
	begin
	lat =  content['results'][0]['geometry']['location']['lat']
	lon =  content['results'][0]['geometry']['location']['lng']
	rescue Exception => e
		open('log', 'a') do |f|
  			f << "#{e.inspect} \n"
  			f << "#{row.inspect} \n"
			end
	end
	sleep 1
	return "#{lat.to_f},#{lon.to_f}"
end

def getLatLon(row)
	address = "#{$address_mapping[row['TIPOVIA']] unless row['TIPOVIA'].nil? } #{row['DESCRIZION']} #{row['CIVICO'].to_i}, Milan, Milan, Italy"
	response =  $geocoding.getLatLon(address.downcase)
	response =  $geocoding.getLatLonByBing(address.downcase) if response.length == 0
	response =  $geocoding.getLatLonByGoogle(address.downcase) if response.length == 0
	if response.length == 0
		response << "#{$address_mapping[row['TIPOVIA']] unless row['TIPOVIA'].nil? } #{row['DESCRIZION']}, #{row['CIVICO'].to_i}, Milano, Milano, Italia"
		response << ""
		response << ""
		open('missing', 'a') do |f|
  			f << "#{row.inspect} \n"
		end
	end
	
	response
end

def servizi_alla_presona
	#SERVIZI ALLA PESONA
	data = File.open("ServiziAllaPersona.json",'w')
	data_items = Array.new
	table = DBF::Table.new("../dbf_data/ServiziAllaPersona.dbf")
	pbar = ProgressBar.new("SAP_#{table.count}", table.count)
	count = 0
	table.each do |row|
		info = getLatLon(row)
		element =  {}
		count += 1
		pbar.set(count)
		element['address'] = info[0]#"#{$address_mapping[row['TIPOVIA']] unless row['TIPOVIA'].nil? } #{row['DESCRIZION']}, #{row['CIVICO'].to_i}, Milan, Italy"
		element['name'] = row['TIPO_ESER_'].split(';')[0]
		element['zone'] = row['ZD'].to_i.to_s
		element['category'] = "ServizioAllaPersona"
		element['sub_category'] = row['TIPO_ESER_'].split(';')
		element['description'] =  "#{row['UBICAZIONE']}".split(';') + ["Superfice esercizio: #{row['SUPERFICI2'].to_i}"]
		element['place'] = info[1]
		element['cap'] = info[2]
		data_items << element
	end
	pbar.finish
	data.write(data_items.to_json)
	data.close
end

def wi_fi
	#SITI OPEN WI-FI
	data = File.open("siti_openwifi2.json",'w')
	data_items = Array.new
	table = DBF::Table.new("../dbf_data/siti_openwifi2.dbf")
	pbar = ProgressBar.new("WiFi_#{table.count}", table.count)
	count=0
	table.each do |row|
		count += 1
		pbar.set(count)
		element =  {}
		element['address'] = row['SITO'].split(';')[0]
		element['name'] = 'Wi-Fi ' + row['CODICE']
		element['zone'] = row['ZONA']
		element['category'] = "Wi-Fi"
		element['place'] = "#{row['LATITUDINE'].to_f},#{row['LONGITUDIN'].to_f}"
		data_items << element
	end
	pbar.finish
	data.write(data_items.to_json)
	data.close
end

def somministrazione_fuori_piano
	data = File.open("SomministrazioneFuoriPiano.json",'w')
	data_items = Array.new
	table = DBF::Table.new("../dbf_data/SomministrazioneFuoriPiano.dbf")
	pbar = ProgressBar.new("SFP_#{table.count}", table.count)
	count=0
	table.each do |row|
		info = getLatLon(row)
		count += 1
		pbar.set(count)
		element =  {}
		element['address'] = info[0]#"#{$address_mapping[row['TIPOVIA']] unless row['TIPOVIA'].nil? } #{row['DESCRIZION']}, #{row['CIVICO'].to_i}, Milan, Italy"
		element['name'] = row['INSEGNA'] || 'Servizio pubblico'
		element['zone'] = row['ZD'].to_i.to_s
		element['category'] = "PubblicoEsercizio"
		element['sub_category'] = ["Pubblici Esercizi Fuori Piano"]
		element['description'] = ["Forma commerciale: #{row['FORMA_COMM']}","Forma vendita: #{row['FORMA_VEND']}", "Superfice esercizio: #{row['SUPERFICIE'].to_i}" ] + "#{row['UBICAZIONE']}".split(';')
		element['place'] = info[1]
		element['cap'] = info[2]
		data_items << element
	end
	pbar.finish
	data.write(data_items.to_json)
	data.close
end

def somministrazione_in_piano
	data = File.open("SomministrazioneInPiano.json",'w')
	data_items = Array.new
	table = DBF::Table.new("../dbf_data/SomministrazioneInPiano.dbf")
	pbar = ProgressBar.new("SIP_#{table.count}", table.count)
	count = 0
	table.each do |row|
		count += 1
		pbar.set(count)
		info = getLatLon(row)
		element =  {}
		element['address'] = info[0]#"#{$address_mapping[row['TIPOVIA']] unless row['TIPOVIA'].nil? } #{row['DESCRIZION']}, #{row['CIVICO'].to_i}, Milan, Italy"
		element['name'] = row['TIPO_ESER_'] || 'Servizio pubblico'
		element['zone'] = row['ZD'].to_i.to_s
		element['category'] = "PubblicoEsercizio"
		element['sub_category'] = ["Pubblici Esercizi In Piano"]
		element['description'] = ["Forma commerciale: #{row['FORMA_COMM']}","Forma vendita: #{row['FORMA_VEND']}", "#{row['SETTORE_ST']}"] + "#{row['UBICAZIONE']}".split(';')
		element['place'] = info[1]
		element['cap'] = info[2]
		data_items << element
	end
	pbar.finish
	data.write(data_items.to_json)
	data.close
end

def strutture_alberghiere
	#STRUTTURE ALBERGHIERE
	data = File.open("StruttureAlberghiere.json",'w')
	data_items = Array.new
	table = DBF::Table.new("../dbf_data/StruttureAlberghiere.dbf")
	pbar = ProgressBar.new("SA_#{table.count}", table.count)
	count = 0
	table.each do |row|
		count += 1
		pbar.set(count)
		info = getLatLon(row)
		element =  {}
		element['address'] = info[0]#"#{$address_mapping[row['TIPOVIA']] unless row['TIPOVIA'].nil? } #{row['DESCRIZION']}, #{row['CIVICO'].to_i}, Milan, Italy"
		element['name'] = row['INSEGNA'] || 'Albergo'
		element['zone'] = row['ZD'].to_i.to_s
		element['category'] = "StruttureRicettiveAlberghiere"
		element['sub_category'] = [row['TIPO_ATT_S']]
		element['description'] = ["Numero camere #{row['CAMERE'].to_i}", "Stelle: #{row['CATEGORIA'].to_i}"] + "#{row['UBICAZIONE']}".split(';')
		element['number_of_rooms'] = "#{row['CAMERE'].to_i}" unless row['CAMERE'].nil?
		element['number_of_stars'] = "#{row['CATEGORIA'].to_i}" unless row['CATEGORIA'].nil?
		element['place'] = info[1]
		element['cap'] = info[2]
		data_items << element
end
data.write(data_items.to_json)
data.close	
	
end

def vendita_sede_fissa
	data = File.open("VenditaSedeFissa_EV.json",'w')
	data_items = Array.new
	table = DBF::Table.new("../dbf_data/VenditaSedeFissa_EV.dbf")
	pbar = ProgressBar.new("VSF_#{table.count}", table.count)
	count = 0
	table.each do |row|
		count += 1
		pbar.set(count)
		info = getLatLon(row)
		element =  {}
		element['address'] = info[0]#"#{$address_mapping[row['TIPOVIA']] unless row['TIPOVIA'].nil? } #{row['DESCRIZION']}, #{row['CIVICO'].to_i}, Milan, Italy"
		element['name'] = row['INSEGNA'] || 'Piccola-Media Attività commericale'
		element['zone'] = row['ZD'].to_i.to_s
		element['category'] = "AttivitàCommerciale"
		element['sub_category'] = "#{row['SETTORE_ME']}".split(";") 
		element['description'] = ["Piccola-Media attività commericale"] + "#{row['UBICAZIONE']}".split(';')
		element['place'] = info[1]
		element['cap'] = info[2]
		data_items << element
	end
	data.write(data_items.to_json)
	data.close
	
end

def vendita_sede_fissa_mg
	#VENDITA SEDE FISSA MG
	data = File.open("VenditaSedeFissa_EV-MG.json",'w')
	data_items = Array.new
	table = DBF::Table.new("../dbf_data/VenditaSedeFissa_EV-MG.dbf")
	pbar = ProgressBar.new("VSFMG_#{table.count}", table.count)
	count = 0
	table.each do |row|
		count += 1
		pbar.set(count)
		info = getLatLon(row)
		element =  {}
		element['address'] = info[0]#{}"#{$address_mapping[row['TIPOVIA']] unless row['TIPOVIA'].nil? } #{row['DESCRIZION']}, #{row['CIVICO'].to_i}, Milan, Italy"
		element['name'] = row['INSEGNA'] || 'Grande attività commericale'
		element['zone'] = row['ZD'].to_i.to_s
		element['category'] = "ServizioPubblico"
		element['sub_category'] = "#{row['SETTORE_ME']}".split(";") 
		element['description'] = ["Grande attività commericale" ]  + "#{row['UBICAZIONE']}".split(';')
		element['place'] = info[1]
		element['cap'] = info[2]
		data_items << element
	end
	data.write(data_items.to_json)
	data.close
	
end


#servizi_alla_presona
#wi_fi
#somministrazione_fuori_piano
#somministrazione_in_piano
strutture_alberghiere
vendita_sede_fissa
vendita_sede_fissa_mg