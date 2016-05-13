class SparqlEndpoint < ActiveRecord::Base
	validates :name, presence: true, length: {minimum: 3, maximum: 100}
	validates :endpoint, presence: true, endpoint: true, length: {minimum: 10, maximum: 150}

	has_many :sparqlQueries, inverse_of: :sparqlEndpoint

	belongs_to :user, inverse_of: :sparqlEndpoints
end
