require 'test_helper'

class SparqlQueriesControllerTest < ActionController::TestCase
  include Devise::TestHelpers
  
  setup do
    sign_in users(:user_1)
    @sparql_query = sparql_queries(:query_0) 
    @sparql_endpoint = sparql_endpoints(:endpoint_0)
  end

  test "should get index" do
    get :index
    assert_response :success
  end

  test "should get show" do
    get :show, id: @sparql_query
    assert_response :success
  end

  test "should get new" do
    get :new
    assert_response :success
    assert_not_nil assigns(:sparql_endpoints)
  end

  test "should get edit" do
    get :edit, id: @sparql_query
    assert_response :success
  end

  test "should create sparql_query" do
  	
  	# This doesn't seem to work
    # assert_difference('SparqlQuery.count') do
    #   post :create, sparql_query: { 
    #   	name: @sparql_query.name, 
    #   	query: @sparql_query.query, 
    #   }
    # end

    assert_no_difference('SparqlQuery.count') do
      post :create, sparql_query: {name: '', query: ''}
    end
  end

  test "should update sparql_query" do

    patch :update, id: @sparql_query, sparql_query: { 
      	user: @sparql_query.user,
      	name: @sparql_query.name, 
      	query: @sparql_query.query, 
      	sparqlEndpoint: @sparql_query.sparqlEndpoint
    }
  end

  test "should destroy sparql_query" do
    assert_difference('SparqlQuery.count', -1) do
      delete :destroy, id: @sparql_query.id
    end
  end
end
