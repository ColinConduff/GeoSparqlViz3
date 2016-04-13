class CreateSparqlQueries < ActiveRecord::Migration
  def change
    create_table :sparql_queries do |t|
      t.string :name, null: false
      t.text :query, null: false

      t.references :user, index: true
      t.references :parent_query, index: true
      t.references :sparql_endpoint, index: true
      t.timestamps null: false
    end
  end
end
