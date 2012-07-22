class Place < ActiveRecord::Base
  has_many :check_ins
  attr_accessible :lat, :long, :name, :place_id
end
