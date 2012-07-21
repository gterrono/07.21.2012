class User < ActiveRecord::Base
  attr_accessible :email, :name, :password_hash

  validates :email, :presence => true, :uniqueness => true
  validates :name, :presence => true
  validates :password_hash, :presence => true
end
