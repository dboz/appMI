require 'rubygems'
require "json"
require 'rsolr'

def humanize(str)
  if str.nil?
   return ""
  end
  str.gsub!(/([A-Z]+|[A-Z][a-z])/) {|x| ' ' + x }
  str.gsub!(/[A-Z][a-z]+/) {|x| ' ' + x }
  return str.split(' ').join(' ').downcase
end

i = 0

data_items = Array.new
Dir.glob("/var/appMI/lib/**.json").each do |file|
	json = JSON.parse(File.open(file,'r').read)
	json.each do |element|
		element['id'] = i
		element['category'] = humanize(element['category'])
		sub_categories = Array.new
		element['sub_category'].each do |e|
			sub_categories << humanize(e)
		end
		element['sub_category'] = sub_categories
		data_items << element
		i += 1
	end

end

puts data_items.length

solr_testing = RSolr.connect(:read_timeout => 120, :open_timeout => 120, :url => "http://localhost:8080/solr/appmi") #"http://geoportal-dev.ies.jrc.it:8090/solr"

solr_testing.update :data => '<delete><query>*:*</query></delete>'
solr_testing.commit

errors = File.open("solr_errors",'w')
data_items.each_with_index do |data_item,index|
	begin		
		solr_testing.add data_item
		solr_testing.commit
	rescue Exception => e  
		errors.write(e.message)
		errors.write(e.backtrace.inspect)
		errors.write(data_item.inspect)
	end
end

errors.close
