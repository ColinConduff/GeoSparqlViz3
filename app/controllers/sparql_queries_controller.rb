class SparqlQueriesController < ApplicationController
  before_action :authenticate_user!
	before_action :all_sparql_queries, only: [:new, :index, :create, :update, :destroy]
  before_action :set_sparql_queries, only: [:edit, :update, :destroy]
  respond_to :html, :js

  def new
    @sparql_query = SparqlQuery.new
  end

  def create
    @sparql_query = SparqlQuery.new(query_params)
    @sparql_query.user_id = current_user.id
    @sparql_query.save
  end

  def update
    @sparql_query.update_attributes(query_params)
  end

  def destroy
    @sparql_query.destroy
  end

  private

    def all_sparql_queries
      @sparql_queries = SparqlQuery.all
    end

    def set_sparql_queries
      @sparql_query = SparqlQuery.find(params[:id])
    end

    def query_params
      params.require(:sparql_query).permit(:name, :query, :sparql_endpoint_id)
    end
end
