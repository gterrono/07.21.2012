class Address < ActiveRecord::Base
  belongs_to :user

  has_many :requests

  attr_accessible :state, :street_address, :zip
end
