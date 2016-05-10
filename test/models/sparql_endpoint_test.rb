require 'test_helper'

class SparqlEndpointTest < ActiveSupport::TestCase

  test "should successfually create a valid sparql endpoint with all parameters" do
  	endpoint = SparqlEndpoint.create(name: 'hello', endpoint: 'http://hello.com')
  	assert endpoint.valid?, "Valid Sparql Endpoint was not successfully created"
  end

  test "should not create endpoint without name" do
    endpoint = SparqlEndpoint.create(endpoint: 'http://hello.com')
    assert_not endpoint.valid?, "Created the endpoint without a name."
  end

  test "should not create a Sparql endpoint without an endpoint" do
    endpoint = SparqlEndpoint.create(name: 'hello')
    assert_not endpoint.valid?, "Created the Sparql endpoint without an endpoint."
  end

  test "should not create a Sparql endpoint without http or https in endpoint" do
    endpoint = SparqlEndpoint.create(name: 'hello', endpoint: 'hello.com')
    assert_not endpoint.valid?, "Created an invalid endpoint. Must have http or https."
  end
end
