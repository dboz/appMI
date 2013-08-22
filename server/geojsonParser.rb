require 'rubygems'

require 'json'
require 'open-uri'
require 'yaml'


config = YAML.load_file("config.yml")
geojson_path = config['resources']['resource_path']
geojson_zone = config['resources']['zones']


def read_zones_file()
	begin
  
  items = Array.new
	File.open(geojson_zone,'r') do |rss|
  		feed = RSS::Parser.parse(rss)
  		feed.items.each do |item|
    		items << item
  		end
	end
  rescue
    puts "Empty cache"
    items
  end
    items
end


