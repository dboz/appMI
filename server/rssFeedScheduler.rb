require 'rubygems'
require 'json'
require 'rss'
require 'yaml'

puts "Loading configuration ... "

config = YAML.load_file("config.yml")
scheduler_time = config['scheduler']['timer']
static_content = config['rss_feeds']
rss_feeds_path = config['resources']['resource_path'] #path to cache rss feeds

puts "Successfully Loaded Configuration data"

def store_rss(hash_urls, rss_feeds_path)
	hash_urls.each do |key, url|
  	puts "Loading IPCHEM #{key} rss"	
    File.open("#{rss_feeds_path}/#{key}.xml","w") do |f|
 			f.write(RSS::Parser.parse(url))
		end
    puts "IPCHEM #{key} rss cached \n"	
	end

end

t = Thread.new do
  puts 'Start scheduler'
  while true do
   	store_rss(static_content, rss_feeds_path)
    sleep scheduler_time
  end
end

t.join

