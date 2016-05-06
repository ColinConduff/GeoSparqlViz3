class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :sparqlQueries
  has_many :sparqlEndpoints

  # Adds the USGS sparql endpoint to each new user that registers for the first time
  after_create do |user|
	@sparql_endpoint = SparqlEndpoint.new()
    @sparql_endpoint.user_id = user.id
    @sparql_endpoint.name = "USGS National Hydrography Data"
    @sparql_endpoint.endpoint = "http://usgs-ybother.srv.mst.edu/fuseki/NHD/query"
    @sparql_endpoint.save
  end
end
