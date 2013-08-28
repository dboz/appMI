require "rubygems"
require "sinatra"
require "sinatra/reloader" if development?
require "sinatra/json"
require "sinatra/jsonp"
require 'json'
require 'multi_json'
require 'yaml'
require './geojsonParser.rb'

register Sinatra::Reloader


config = YAML.load_file("config.yml")

port = config['server']['port']
enviroment = config['server']['enviroment']
public_folder = config['server']['public_folder']
rack_server = config['server']['rack_server']

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

set :port, port
set :environment, enviroment
set :session, false
set :run, true
set :server, rack_server
set :public_folder, public_folder

#http://gis.stackexchange.com/questions/43216/how-do-you-put-geojson-attribute-information-in-a-popup-with-openlayers
# 3 manager per le tre ricerche

get "/" do
	redirect '/index.html'
end

get '/getZones' do
  response = get_zone_geojson(geojson_path, geojson_zone)
  content_type :json
  jsonp response, 'parseGeojson'
end

get '/getZone/:number' do
  response = get_zone_geojson_by_zone(params[:number].to_i, geojson_path, geojson_zone)
  content_type :json
  jsonp response, 'parseGeojson'
end

get '/getTrainStation' do
   response = get_train_station_geojson(geojson_path, geojson_train_station)
   content_type :json
end

get '/getRails' do
  response = get_rails_geojson(geojson_path, geojson_rails)
  content_type :json
  jsonp response, 'parseGeojson'
end

get '/getMetroLines' do
  response = get_metro_lines_geojson(geojson_path, geojson_metro_lines)
  content_type :json
  jsonp response, 'parseGeojson'
end

get '/getMetroStations' do
  response = get_metro_stations_geojson(geojson_path, geojson_metro_stations)
  content_type :json
  jsonp response, 'parseGeojson'
end

get '/getDogZone' do
  response = get_dog_zone_geojson(geojson_path, geojson_dog_zone)
  content_type :json
  jsonp response, 'parseGeojson'
end

get '/getParks' do
  response = get_parks_geojson(geojson_path, geojson_parks)
  content_type :json
  jsonp response, 'parseGeojson'
end
=begin
get '/getBikeParking' do
  response = get_bike_parking(geojson_path, geojson_bike_parking)
  content_type :json
  jsonp response, 'parseGeojson'
end
=end
get '/getBikePaths' do
  response = get_bike_paths(geojson_path, geojson_bike_paths)
  content_type :json
  jsonp response, 'parseGeojson'
end
