class User < ActiveRecord::Base
  attr_accessible :email, :name, :password_hash

  has_many :check_ins
  has_many :addresses

  validates :email, :presence => true, :uniqueness => true
  validates :name, :presence => true
  validates :password_hash, :presence => true
end
