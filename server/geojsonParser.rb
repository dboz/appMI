require 'rubygems'

require 'json'
require 'open-uri'
require 'yaml'


config = YAML.load_file("config.yml")
geojson_path = config['resources']['resource_path']
geojson_zone = config['resources']['zones']


def get_zone_geojson(geojson_path, geojson_zone)
	begin
   geojson = JSON.parse(File.open("#{geojson_path}/#{geojson_zone}","r").read)
  rescue
  end
  return geojson.to_json
end

def get_zone_geojson_by_zone(zone, geojson_path, geojson_zone)
	index = zone+1
  geojson = JSON.parse(File.open("#{geojson_path}/#{geojson_zone}","r").read)
  zone_poligon = geojson['features'][index]
  geojson['features'] = [zone_poligon]
  puts geojson['features'].length
  return geojson.to_json
end


