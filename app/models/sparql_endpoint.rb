class SparqlEndpoint < ActiveRecord::Base
	validates :name, presence: true
	validates :endpoint, presence: true, endpoint: true

	has_many :sparqlQueries, inverse_of: :sparqlEndpoint

	belongs_to :user, inverse_of: :sparqlEndpoints
end
