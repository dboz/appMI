require 'rubygems'
require 'rss'
require 'json'
require 'open-uri'
require 'yaml'


config = YAML.load_file("config.yml")
rss_feeds_path = config['resources']['resource_path'] #path to cache rss feeds
rss_feeds = config['rss_feeds']


def read_rss_by_file(filename)
	begin
  items = Array.new
	File.open(filename,'r') do |rss|
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

def get_rss_by_cache(rss_feeds, rss_feeds_path )
	items = Array.new
	rss_feeds.each do |key, url|
  		items = items + read_rss_by_file("#{rss_feeds_path}/#{key}.xml")
	end
	items = items.sort { |x, y| x.pubDate <=> y.pubDate }
  items.reverse
end

def get_all_sorted_rss(num,rss_feeds, rss_feeds_path)
  response = Array.new
  items = get_rss_by_cache(rss_feeds, rss_feeds_path)
  items[0..num].each do |item|
    response << {
      :title => item.title,
      :link => item.link,
      :description => item.description,
      :category => item.category,
      :source => item.source,
      :pubDate => item.pubDate
    }
  end
  response
end


get_all_sorted_rss(5,rss_feeds, rss_feeds_path)
