class CreateSparqlEndpoints < ActiveRecord::Migration
  def change
    create_table :sparql_endpoints do |t|
      t.string :name, null: false
      t.text :endpoint, null: false

      t.references :user, index: true
      t.timestamps null: false
    end
  end
end
