class CheckIn < ActiveRecord::Base
  belongs_to :user
  belongs_to :place

  has_many :requests

  attr_accessible :fee, :time_staying

  def to_json(options=nil)
    id = "{\"id\":"+self.id.to_s
    created_at = ",\"created_at\":\""+self.created_at.to_s
    updated_at = "\",\"updated_at\":\""+self.updated_at.to_s

    place_id = "\",\"place_id\":\""+self.place.place_id.to_s
    name = "\",\"name\":\""+self.place.name.to_s
    lat = "\",\"lat\":\""+self.place.lat.to_s
    lon = "\",\"lon\":\""+self.place.long.to_s
    time_staying = "\",\"time_staying\":\""+(self.time_staying.to_i*60).to_s
    posted = "\",\"posted\":\""+self.updated_at.to_i.to_s
    user = "\",\"user\":\""+self.user.name.to_s
    fee = "\",\"fee\":\""+self.fee.to_s

    id + created_at + updated_at + place_id + name + lat + lon + time_staying + posted + user + fee +"\"}"
  end
end
