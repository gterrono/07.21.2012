class Request < ActiveRecord::Base
  belongs_to :user
  belongs_to :address
  belongs_to :check_in

  has_one :response

  attr_accessible :details, :order, :payment
end
