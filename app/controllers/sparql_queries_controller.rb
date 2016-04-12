class SparqlQueriesController < ApplicationController

  before_action :authenticate_user!
	before_action :all_sparql_queries, only: [:index, :edit, :new, :create, :update, :destroy]
  before_action :set_sparql_queries, only: [:edit, :update, :destroy]
  before_action :get_data_for_form, only: [:new, :edit]
  respond_to :html, :js

  # update this to only show root sparql queries
  # .where('parent_query_id = nil/null')
  def index
    # @other_user_queries = SparqlQuery.joins(:user).uniq.where('user_id != ?', current_user )
    # @current_user_queries = SparqlQuery.joins(:user).uniq.where('user_id = ?', current_user )
    @this_is_the_index_page = true
  end

  def show
    # @sparql_queries = SparqlQuery.joins(:user).uniq.where('user_id = ?', current_user )
    @sparql_queries = find_all_child_queries(params[:id])
    @this_is_the_index_page = false
  end

  def new
    @sparql_query = SparqlQuery.new
  end

  def create
    @sparql_query = SparqlQuery.new(query_params)
    @sparql_query.user_id = current_user.id
    @sparql_query.save
  end

  def edit
  end

  def update
    @sparql_query.update_attributes(query_params)
  end

  def destroy
    @sparql_query.destroy
  end

  private

    def all_sparql_queries
      @sparql_queries = SparqlQuery.joins(:user).uniq.where('user_id = ?', current_user )
    end

    def set_sparql_queries
      @sparql_query = SparqlQuery.find(params[:id])
    end

    def get_data_for_form

      @sparql_endpoints = SparqlEndpoint.all 
      @parent_queries = SparqlQuery.all

      # no sparql endpoints are returned?
      # @sparql_endpoints = SparqlEndpoint.joins(:user).uniq.where('user_id = ?', current_user )
      
      # adding and id = ? breaks form
      # @parent_queries = SparqlQuery.joins(:user).uniq.where('user_id = ? AND id = ?', current_user, sparql_query.id )
    end

    def find_all_child_queries(parent_id)
      child_queries = []
      child_queries << SparqlQuery.find(parent_id)

      direct_child_queries = SparqlQuery.where(parent_query_id: parent_id) 
      direct_child_queries.each do |query|
        child_queries.concat(find_all_child_queries(query.id))
      end

      # return child_queries array
      child_queries 
    end

    def query_params
      params.require(:sparql_query).permit(:name, :query, :sparql_endpoint_id, :parent_query_id)
    end
end
