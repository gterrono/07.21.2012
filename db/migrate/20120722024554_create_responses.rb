class CreateResponses < ActiveRecord::Migration
  def change
    create_table :responses do |t|
      t.references :request
      t.boolean :accepted
      t.string :message

      t.timestamps
    end
    add_index :responses, :request_id
  end
end
