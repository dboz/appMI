require 'rubygems'
require 'sinatra'
require 'sinatra/reloader' if development?
require "sinatra/json"
require "sinatra/jsonp"
require 'json'
require 'multi_json'
require 'yaml'
require 'geojsonParser.rb'




config = YAML.load_file("config.yml")

port = config['server']['port']
enviroment = config['server']['enviroment']
public_folder = config['server']['public_folder']
rack_server = config['server']['rack_server']
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

get '/getZone' do
  geojson_zone = config['resources']['zones']
end

get '/getFeedRss/:category/:number' do
  if(params[:number].nil? || params[:category].nil?)
    return json({"response" => {:error => "number and/or category parameters are missing"}}, :encoder => :to_json, :content_type => :js)
  end
  response = get_all_sorted_rss(params[:number].to_i - 1,[params[:category]=>''], rss_feeds_path)
  jsonp response, 'parseResponse'
end


