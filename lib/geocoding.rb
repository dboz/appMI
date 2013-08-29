require 'rubygems'
require 'csv'
require 'json'
require 'dbf'
require 'open-uri'
require 'geocoder'
require "./progressbar.rb"

class Geocoding
	include Geocoder
		
	def getLatLon(address)
		begin
			response = Array.new
			Geocoder.configure(:lookup => :yandex, :timeout => 5, :api_key => '')
			results = Geocoder.search(address)
			results.each do |result|
				if result.city == 'Milan'
					response << "#{result.address}"
					response << "#{result.latitude.to_f},#{result.longitude.to_f}"
					response << "#{result.postal_code}"
				end
			end
		rescue Exception => e
			open('log', 'a') do |f|
  				f << "#{e.inspect} \n"
  				f << "#{address} \n"
			end
		end
		return response
	end
	

	def getLatLonByGoogle(address)
		begin
			response = Array.new
			Geocoder.configure(:lookup => :google, :timeout => 5, :api_key => '')
			Geocoder.search(address)
			results = Geocoder.search(address)
			sleep 0.5
			results.each do |result|
				if result.city == 'Milan'
					response << "#{result.address}"
					response << "#{result.latitude.to_f},#{result.longitude.to_f}"
					response << "#{result.postal_code}"
				end
			end
		rescue Exception => e
			open('log', 'a') do |f|
  				f << "#{e.inspect} \n"
  				f << "#{address} \n"
			end
		end
		return response
		
	end

	def getLatLonByBing(address)
		begin
			response = Array.new
			Geocoder.configure(:lookup => :bing, :timeout => 5, :api_key => 'AtvXwjiVtL1UiVgtKFRXEPjLwZ5-6HAFodUF2vdj1tCjdzmDKHvIiQgX1dGH6P8R')
			results = Geocoder.search(address)
			results.each do |result|
				if result.city == 'Milan'
					response << "#{result.address}"
					response << "#{result.latitude.to_f},#{result.longitude.to_f}"
					response << "#{result.postal_code}"
				end
			end
		rescue Exception => e
			open('log', 'a') do |f|
  				f << "#{e.inspect} \n"
  				f << "#{address} \n"
			end
		end
		return response
	end

end

