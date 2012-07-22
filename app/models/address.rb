class Address < ActiveRecord::Base
  belongs_to :user
  attr_accessible :state, :street_address, :zip
end
