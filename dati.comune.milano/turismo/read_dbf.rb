require 'rubygems'
require "dbf"

def sanitize_filename(filename)
  filename = filename.gsub(/\d+/, '').gsub("_",'').gsub(" ","")
  fn = filename.split /(?=[A-Z])/
  return fn.join ''
end

fields = ["x","Y","DENOMINAZ", "CATEGORIA","INFO", "ZONA"]

Dir.glob("C:/Users/benetal/Downloads/dati.comune.milano/turismo/Cinema/**.dbf").each do |file|
	resource_type = sanitize_filename(File.basename(file, ".dbf"))
	table = DBF::Table.new(file)
	table.each do |row|
		table.columns.each do |column|
			puts column.name
			puts row[column.name]
		end
	end


end


