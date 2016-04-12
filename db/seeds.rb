# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

User.create!([
  {email: "test2@gmail.com", password: "test2345", password_confirmation: "test2345"}#,
  #{email: "test3@gmail.com", password: "test3456", password_confirmation: "test3456"}
])

user1 = User.create!(email: "test1@gmail.com", password: "test1234", password_confirmation: "test1234")

sparql_queries_list = [
	["Get Feature Types", "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> SELECT DISTINCT ?type WHERE { ?feature rdf:type ?type . }"],
	["Get Feature Relationships of Type AirportPoint", "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> SELECT DISTINCT ?rel WHERE { ?feature rdf:type <http://cegis.usgs.gov/rdf/trans/airportPoint> ; ?rel ?obj . }"],
	["Get Features of Given Type and Relationship", "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT DISTINCT ?feature ?label WHERE { # Select features of the specified type: ?feature rdf:type <http://cegis.usgs.gov/rdf/trans/airportPoint> . ?feature rdfs:label ?label . # Filter features by property: ?feature <http://www.w3.org/2000/01/rdf-schema#label> ?obj . FILTER( regex(str(?obj), 'airport', 'i' ) ) . }"],
	["Get WKT data for feature", "PREFIX geo: <http://www.opengis.net/ont/geosparql#> SELECT ?wkt WHERE { <http://cegis.usgs.gov/rdf/trans/Features/VA000145> geo:hasGeometry ?g . ?g geo:asWKT ?wkt . }"]
]

se = SparqlEndpoint.create(name: "USGS NHD", endpoint: "http://usgs-ybother.srv.mst.edu/fuseki/NHD/query");

# Yes this is a very silly way to do this
sq1 = SparqlQuery.create(
	name: sparql_queries_list[0][0], 
	query: sparql_queries_list[0][1],
	user_id: user1.id,
	sparql_endpoint_id: se.id
);
sq2 = SparqlQuery.create(
	name: sparql_queries_list[1][0], 
	query: sparql_queries_list[1][1], 
	user_id: user1.id,
	sparql_endpoint_id: se.id,
	parent_query_id: sq1.id
);
sq3 = SparqlQuery.create(
	name: sparql_queries_list[2][0], 
	query: sparql_queries_list[2][1],
	user_id: user1.id,
	sparql_endpoint_id: se.id,
	parent_query_id: sq2.id
);
sq4 = SparqlQuery.create(
	name: sparql_queries_list[3][0], 
	query: sparql_queries_list[3][1], 
	user_id: user1.id,
	sparql_endpoint_id: se.id,
	parent_query_id: sq3.id
);
