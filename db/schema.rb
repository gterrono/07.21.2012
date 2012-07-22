# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120722024554) do

  create_table "addresses", :force => true do |t|
    t.string   "street_address"
    t.string   "state"
    t.integer  "zip"
    t.integer  "user_id"
    t.datetime "created_at",     :null => false
    t.datetime "updated_at",     :null => false
  end

  add_index "addresses", ["user_id"], :name => "index_addresses_on_user_id"

  create_table "check_ins", :force => true do |t|
    t.integer  "user_id"
    t.integer  "time_staying"
    t.integer  "place_id"
    t.decimal  "fee"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  add_index "check_ins", ["place_id"], :name => "index_check_ins_on_place_id"
  add_index "check_ins", ["user_id"], :name => "index_check_ins_on_user_id"

  create_table "places", :force => true do |t|
    t.integer  "place_id"
    t.string   "name"
    t.decimal  "lat"
    t.decimal  "long"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "requests", :force => true do |t|
    t.integer  "user_id"
    t.integer  "address_id"
    t.string   "order"
    t.string   "details"
    t.decimal  "payment"
    t.integer  "check_in_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  add_index "requests", ["address_id"], :name => "index_requests_on_address_id"
  add_index "requests", ["check_in_id"], :name => "index_requests_on_check_in_id"
  add_index "requests", ["user_id"], :name => "index_requests_on_user_id"

  create_table "responses", :force => true do |t|
    t.integer  "request_id"
    t.boolean  "accepted"
    t.string   "message"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "responses", ["request_id"], :name => "index_responses_on_request_id"

  create_table "users", :force => true do |t|
    t.string   "email"
    t.string   "name"
    t.text     "password_hash"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

end
