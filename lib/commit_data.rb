require 'rubygems'
require "json"
require 'rsolr'


i = 0

data_items = Array.new
Dir.glob("E:/github/appMI/lib/**.json").each do |file|
	json = JSON.parse(File.open(file,'r').read)
	json.each do |element|
		element['id'] = i
		data_items << element
		i += 1
	end

end

puts data_items.length

solr_testing = RSolr.connect(:read_timeout => 120, :open_timeout => 120, :url => "http://localhost:8080/solr2/collection1") #"http://geoportal-dev.ies.jrc.it:8090/solr"

solr_testing.update :data => '<delete><query>*:*</query></delete>'
solr_testing.commit

errors = File.open("errors",'w')
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
