class SparqlEndpointsController < ApplicationController

  before_action :authenticate_user!
  before_action :all_sparql_endpoints, only: [:new, :index, :create, :update, :destroy]
  before_action :set_sparql_endpoint, only: [:edit, :update, :destroy]
  respond_to :html, :js

  def new
    @sparql_endpoint = SparqlEndpoint.new
  end

  def create
    @sparql_endpoint = SparqlEndpoint.new(endpoint_params)
    @sparql_endpoint.user_id = current_user.id
    @sparql_endpoint.save
  end

  def update
    @sparql_endpoint.update_attributes(endpoint_params)
  end

  def destroy
    @sparql_endpoint.destroy
  end

  private

    def all_sparql_endpoints
      @sparql_endpoints = SparqlEndpoint.all
    end

    def set_sparql_endpoint
      @sparql_endpoint = SparqlEndpoint.find(params[:id])
      # headers['Access-Control-Request-Methods'] = 'GET'
      # headers['Access-Control-Allow-Origin'] = 'http://' + @sparql_endpoint[:endpoint].split('/')[2]
      # headers['Access-Control-Allow-Credentials'] = 'true'
    end

    def endpoint_params
      params.require(:sparql_endpoint).permit(:name, :endpoint)
    end
end
