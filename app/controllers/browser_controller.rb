class BrowserController < ApplicationController
  before_action :authenticate_user!

  # update this to only show root sparql queries
  # .where('parent_query_id = nil/null')
  def index
  	@sparql_queries = SparqlQuery.joins(:user).uniq.where('user_id != ?', current_user )
  	@current_user_queries = SparqlQuery.joins(:user).uniq.where('user_id = ?', current_user )

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @sparql_queries }
      format.js
    end
  end
end