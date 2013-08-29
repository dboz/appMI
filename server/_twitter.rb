require "rubygems"

require 'json'
require 'multi_json'
require 'yaml'
require 'oauth'
require 'oauth/consumer'
require 'twitter'


def prepare_access_token(oauth_token, oauth_token_secret)
  consumer = OAuth::Consumer.new("2eNpwKU11Xx1crG22GrIQ", "M8VjMF0cfT8GNy5oIZASjklaU0x2xwHHAl0a5FgqedA",
    { :site => "http://api.twitter.com",
      :scheme => :header
    })
  # now create the access token object from passed values
  token_hash = { :oauth_token => oauth_token,
                 :oauth_token_secret => oauth_token_secret
               }
  access_token = OAuth::AccessToken.from_hash(consumer, token_hash )
  return access_token
end

  # Exchange our oauth_token and oauth_token secret for the AccessToken instance.
  access_token = prepare_access_token("1710070567-X8Sjm16ThO5ehcf0kxLUCIJ7whBBzf1THY5gwpk", "zMmDvu5vclQfsLqvUP6yyF6lwDShCS0L0QoijbPYY")
# use the access token as an agent to get the home timeline
  url = "https://api.twitter.com/1.1/geo/search.json?lat=#{49}&long=#{9}"
  response = access_token.request(:get, url)
  return response
 