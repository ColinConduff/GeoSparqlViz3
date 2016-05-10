require 'test_helper'

class SparqlQueryTest < ActiveSupport::TestCase

  test "should successfually create a valid sparql query with all parameters" do
    endpoint1 = SparqlEndpoint.create!(name: 'hello', endpoint: 'http://hello.com')

    query = SparqlQuery.create(
    	name: 'hello', 
    	query: 'Select ?s Where { ?s ?p ?o }',
    	sparqlEndpoint: endpoint1
    )
    assert query.valid?, "Valid Sparql Query was not successfully created"
  end

  test "should not create a query without a name" do
    query = SparqlQuery.create(query: 'Select ?s Where { ?s ?p ?o }')
    assert_not query.valid?, "Created a query without a name."
  end

  test "should not create a Sparql query without a query" do
    query = SparqlQuery.create(name: 'hello')
    assert_not query.valid?, "Created a Sparql query without a query."
  end

  test "should not create a Sparql query without an associated endpoint" do
    query = SparqlQuery.create(name: 'hello', query: 'Select ?s Where { ?s ?p ?o }')
    assert_not query.valid?, "Created the Sparql query without an associated endpoint."
  end
end
