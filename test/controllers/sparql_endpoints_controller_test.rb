require 'test_helper'

class SparqlEndpointsControllerTest < ActionController::TestCase
  include Devise::TestHelpers
  
  setup do
    sign_in users(:user_1)
    @sparql_endpoint = sparql_endpoints(:endpoint_0)
  end

  test "should get index" do
    get :index
    assert_response :success
  end

  test "should get show" do
    get :show, id: @sparql_endpoint
    assert_response :success
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @sparql_endpoint
    assert_response :success
  end

  test "should create sparql_endpoint" do
    assert_difference('SparqlEndpoint.count') do
      post :create, sparql_endpoint: { 
      	name: @sparql_endpoint.name, 
      	endpoint: @sparql_endpoint.endpoint, 
      }
    end
  end

  test "should update sparql_endpoint" do
    patch :update, id: @sparql_endpoint, sparql_endpoint: { 
      	user: @sparql_endpoint.user,
      	name: @sparql_endpoint.name, 
      	endpoint: @sparql_endpoint.endpoint
    }
  end

  test "should destroy sparql_endpoint" do
    assert_difference('SparqlEndpoint.count', -1) do
      delete :destroy, id: @sparql_endpoint.id
    end
  end
end
