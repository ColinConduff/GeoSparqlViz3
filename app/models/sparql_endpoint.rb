class SparqlEndpoint < ActiveRecord::Base
	has_many :sparqlQueries, inverse_of: :sparqlEndpoint

	belongs_to :user, inverse_of: :sparqlEndpoints
end
