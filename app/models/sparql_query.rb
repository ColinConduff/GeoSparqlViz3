class SparqlQuery < ActiveRecord::Base
	belongs_to :user, inverse_of: :sparqlQueries, :foreign_key => 'user_id'
	
	belongs_to :sparqlEndpoint, inverse_of: :sparqlQueries, :foreign_key => 'sparql_endpoint_id'
	# validates_associated :sparqlEndpoint
	
	belongs_to :parentQuery, class_name: "SparqlQuery", inverse_of: :childQueries
	has_many :childQueries, class_name: "SparqlQuery", foreign_key: "parent_query_id", inverse_of: :parentQuery
end
