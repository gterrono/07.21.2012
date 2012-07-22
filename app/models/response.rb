class Response < ActiveRecord::Base
  belongs_to :request
  attr_accessible :accepted, :message
end
