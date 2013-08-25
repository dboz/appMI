require 'rubygems'

require 'json'
require 'open-uri'
require 'yaml'


config = YAML.load_file("config.yml")
geojson_path = config['resources']['resource_path']
geojson_zone = config['resources']['zones']


def get_zone_geojson(geojson_path, geojson_zone)
	begin
   file = File.open("#{geojson_path}/#{geojson_zone}","r")
   geojson = JSON.parse(file.read)
   file.close
  rescue
  end
  return geojson.to_hash
end

def get_zone_geojson_by_zone(zone, geojson_path, geojson_zone)
	index = zone
  file = File.open("#{geojson_path}/#{geojson_zone}","r")
  geojson = JSON.parse(file.read)
  zone_poligon = geojson['features'][index]
  geojson['features'] = [zone_poligon]
  file.close
  return geojson.to_hash
end


