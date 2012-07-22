class CreateCheckIns < ActiveRecord::Migration
  def change
    create_table :check_ins do |t|
      t.references :user
      t.integer :time_staying
      t.references :place
      t.decimal :fee

      t.timestamps
    end
    add_index :check_ins, :user_id
    add_index :check_ins, :place_id
  end
end
