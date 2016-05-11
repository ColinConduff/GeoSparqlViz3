require 'test_helper'

class WelcomeControllerTest < ActionController::TestCase
  include Devise::TestHelpers
  
  setup do
    sign_in users(:user_1)
  end

  test "should get index" do
    get :index
    assert_response :success
  end
end
