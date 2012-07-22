class Request < ActiveRecord::Base
  belongs_to :user
  belongs_to :address
  belongs_to :check_in

  has_one :response

  attr_accessible :details, :order, :payment

  def to_json(options=nil)
    address = "{\"address\":\""+self.address.street_address
    check_in = "\",\"check_in_id\":"+self.check_in.id.to_s
    created_at = ",\"created_at\":\""+self.created_at.to_s
    details = "\",\"details\":\""+self.details
    id = "\",\"id\":"+self.id.to_s
    order = ",\"order\":\""+self.order
    payment = "\",\"payment\":\""+self.payment.to_s
    updated_at = "\",\"updated_at\":\""+self.updated_at.to_s
    name = "\",\"user_name\":\""+self.user.name+"\"}" 
    address + check_in + created_at + details + id + order + payment + updated_at+ name
  end

end
