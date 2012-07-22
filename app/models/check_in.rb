class CheckIn < ActiveRecord::Base
  belongs_to :user
  belongs_to :place

  has_many :requests

  attr_accessible :fee, :time_staying
end
