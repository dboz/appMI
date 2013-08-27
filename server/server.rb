require "rubygems"
require "sinatra"
require "sinatra/reloader" if development?
require "sinatra/json"
require "sinatra/jsonp"
require 'json'
#gem "multi_json", "~> 1.7.9"
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

set :port, port
set :environment, enviroment
set :session, false
set :run, true
set :server, rack_server
set :public_folder, public_folder

get "/" do
	redirect '/index.html'
end

get '/getZones' do
  response = get_zone_geojson(geojson_path, geojson_zone)
  content_type :json
  #json(response, :encoder => :to_json, :content_type => :js)
  jsonp response, 'parseGeojson'
end

get '/getZone/:number' do
  response = get_zone_geojson_by_zone(params[:number].to_i, geojson_path, geojson_zone)
  content_type :json
  #json(response, :encoder => :to_json, :content_type => :js)
  jsonp response, 'parseGeojson'
end


