require 'test_helper'

class VisualizerControllerTest < ActionController::TestCase
  include Devise::TestHelpers
  
  setup do
    sign_in users(:user_1)
    @sparql_query = sparql_queries(:query_1) 
  end

  test "should get index" do
    get :index, id: @sparql_query
    assert_response :success
    assert_not_nil assigns(:sparql_queries)
  end
end
