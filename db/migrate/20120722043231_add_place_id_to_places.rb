class AddPlaceIdToPlaces < ActiveRecord::Migration
  def change
    add_column :places, :place_id, :string
  end
end
