class ApplicationController < ActionController::Base

	add_flash_types :success, :warning, :danger, :info
	
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  protected
  # after a user logs in redirect to home#index
  def after_sign_in_path_for(resource)
	  browser_path
	end
end
