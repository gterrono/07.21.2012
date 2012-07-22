class CreateAddresses < ActiveRecord::Migration
  def change
    create_table :addresses do |t|
      t.string :street_address
      t.string :state
      t.integer :zip
      t.references :user

      t.timestamps
    end
    add_index :addresses, :user_id
  end
end
