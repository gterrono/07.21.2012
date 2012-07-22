class CheckIn < ActiveRecord::Base
  belongs_to :user
  belongs_to :place

  has_many :requests

  attr_accessible :fee, :time_staying

  def to_json(options=nil)
    id = "{\"id\":"+self.id.to_s
    created_at = ",\"created_at\":\""+self.created_at.to_s
    updated_at = "\",\"updated_at\":\""+self.updated_at.to_s
    fee = "\",\"fee\":\""+self.fee.to_s
    time_staying = "\",\"time_staying\":\""+self.time_staying.to_s
    user = "\",\"user\":\""+self.user.name
    name = "\",\"name\":\""+self.place.name+"\"}"

    id + created_at + updated_at + fee + time_staying + user + name
  end
end
