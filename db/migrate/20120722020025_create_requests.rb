class CreateRequests < ActiveRecord::Migration
  def change
    create_table :requests do |t|
      t.references :user
      t.references :address
      t.string :order
      t.string :details
      t.decimal :payment
      t.references :check_in

      t.timestamps
    end
    add_index :requests, :user_id
    add_index :requests, :address_id
    add_index :requests, :check_in_id
  end
end
