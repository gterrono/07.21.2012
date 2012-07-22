class Place < ActiveRecord::Base
  attr_accessible :lat, :long, :name, :place_id
end
