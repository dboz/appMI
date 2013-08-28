require 'rubygems'

require 'json'
require 'open-uri'
require 'yaml'


config = YAML.load_file("config.yml")
geojson_path = config['resources']['resource_path']

geojson_zone = config['resources']['zones']
geojson_train_station = config['resources']['train_station']
geojson_rails = config['resources']['rails']
geojson_metro_lines = config['resources']['metro_lines']
geojson_metro_stations = config['resources']['metro_stations']
geojson_dog_zone = config['resources']['dog_zone']
geojson_parks = config['resources']['parks']
geojson_bike_parking = config['resources']['bike_parking']
geojson_bike_paths = config['resources']['bike_paths']


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

def get_train_station_geojson(geojson_path, geojson_train_station)
	begin
   file = File.open("#{geojson_path}/#{geojson_train_station}","r")
   geojson = JSON.parse(file.read)
   file.close
  rescue
  end
  return geojson.to_hash
end

def get_rails_geojson(geojson_path, geojson_rails)
	begin
   file = File.open("#{geojson_path}/#{geojson_rails}","r")
   geojson = JSON.parse(file.read)
   file.close
  rescue
  end
  return geojson.to_hash
end

def get_metro_lines_geojson(geojson_path, geojson_metro_lines)
	begin
   file = File.open("#{geojson_path}/#{geojson_metro_lines}","r")
   geojson = JSON.parse(file.read)
   file.close
  rescue
  end
  return geojson.to_hash
end

def get_metro_stations_geojson(geojson_path, geojson_metro_stations)
	begin
   file = File.open("#{geojson_path}/#{geojson_metro_stations}","r")
   geojson = JSON.parse(file.read)
   file.close
  rescue
  end
  return geojson.to_hash
end

def get_dog_zone_geojson(geojson_path, geojson_dog_zone)
	begin
   file = File.open("#{geojson_path}/#{geojson_dog_zone}","r")
   geojson = JSON.parse(file.read)
   file.close
  rescue
  end
  return geojson.to_hash
end

def get_parks_geojson(geojson_path, geojson_parks)
	begin
   file = File.open("#{geojson_path}/#{geojson_parks}","r")
   geojson = JSON.parse(file.read)
   file.close
  rescue
  end
  return geojson.to_hash
end

def get_bike_parking(geojson_path, geojson_bike_parking)
	begin
   file = File.open("#{geojson_path}/#{geojson_bike_parking}","r")
   geojson = JSON.parse(file.read)
   file.close
  rescue
  end
  return geojson.to_hash
end

def get_bike_paths(geojson_path, geojson_bike_paths)
	begin
   file = File.open("#{geojson_path}/#{geojson_bike_paths}","r")
   geojson = JSON.parse(file.read)
   file.close
  rescue
  end
  return geojson.to_hash
end


