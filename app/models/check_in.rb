class CheckIn < ActiveRecord::Base
  belongs_to :user
  belongs_to :place
  attr_accessible :fee, :time_staying
end
