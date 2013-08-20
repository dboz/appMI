require 'rubygems'
require "json"

def humanize(str)
  if str.nil?
   return ""
  end
  str.gsub!(/([A-Z]+|[A-Z][a-z])/) {|x| ' ' + x }
  str.gsub!(/[A-Z][a-z]+/) {|x| ' ' + x }
  return str.split(' ').join(' ').downcase
end



data_items = Array.new

Dir.glob("ServiziAllaPersona.json").each do |file|
	
	json = JSON.parse(File.open(file,'r').read)
	tmp=''
	json.each do |element|
		element['category'] = humanize(element['category'])
		sub_categories = Array.new
		element['sub_category'].each do |e|
			sub_categories << humanize(e)
		end
		element['sub_category'] = sub_categories
		data_items << element
		
	end

end

puts data_items.length

