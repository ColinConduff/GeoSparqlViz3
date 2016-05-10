require 'test_helper'

class UserTest < ActiveSupport::TestCase

  test "should not create a user without an email" do
    user = User.create(password: "test1234", password_confirmation: "test1234")
    assert_not user.valid?, "Created a user without an email address."
  end

  test "should not create a user without a password" do
    user = User.create(email: "test1@gmail.com", password_confirmation: "test1234")
    assert_not user.valid?, "Created a user without a password."
  end
  
  # test after_create method of User model
  test "a newly created user should have the USGS NHD sparql endpoint" do
  	user = User.create!(email: "test1@gmail.com", password: "test1234", password_confirmation: "test1234")
  	endpoint = user.sparqlEndpoints.first.endpoint
  	assert_equal 'http://usgs-ybother.srv.mst.edu/fuseki/NHD/query', 
  	             endpoint, 
  	             "Newly created user does not have the USGS NHD sparql endpoint"
  end
end
