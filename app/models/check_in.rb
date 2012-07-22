class CheckIn < ActiveRecord::Base
  belongs_to :user
  belongs_to :place

  has_many :check_ins

  attr_accessible :fee, :time_staying
end
