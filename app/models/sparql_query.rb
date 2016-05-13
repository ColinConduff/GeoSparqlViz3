class SparqlQuery < ActiveRecord::Base
	validates :name, presence: true, length: {minimum: 3, maximum: 150}
	validates :query, presence: true, length: {minimum: 3, maximum: 1000}
	validates :sparqlEndpoint, presence: true
	
	belongs_to :user, inverse_of: :sparqlQueries, :foreign_key => 'user_id'
	
	belongs_to :sparqlEndpoint, inverse_of: :sparqlQueries, :foreign_key => 'sparql_endpoint_id'
	
	
	# if this breaks again, look here: 
	# http://stackoverflow.com/questions/9250409/understanding-rails-activerecord-single-model-self-joins
	has_many :childQueries, class_name: "SparqlQuery", 
							foreign_key: "parent_query_id", 
							inverse_of: :parentQuery

	belongs_to :parentQuery, class_name: "SparqlQuery", 
							foreign_key: "parent_query_id", 
							inverse_of: :childQueries
end
