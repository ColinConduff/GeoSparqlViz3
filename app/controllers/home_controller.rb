class HomeController < ApplicationController
  before_action :authenticate_user!

  def browse
  	@sparql_queries = SparqlQuery.joins(:user).uniq
  	@current_user_queries = SparqlQuery.joins(:user).uniq.where('user_id = ?', current_user )

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @sparql_queries }
      format.js
    end
  end

  def editor
  end

  def visualize
  end
end
