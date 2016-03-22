class SparqlEndpointsController < ApplicationController
  
  before_action :authenticate_user!

  # GET /sparql_endpoints
  # GET /sparql_endpoints.json
  def index
    @sparql_endpoints = SparqlEndpoint.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @sparql_endpoints }
      format.js
    end
  end

  # GET /sparql_endpoints/1
  # GET /sparql_endpoints/1.json
  def show
    @sparql_endpoint = SparqlEndpoint.find(params[:id])
    headers['Access-Control-Request-Methods'] = 'GET'
    headers['Access-Control-Allow-Origin'] = 'http://' + @sparql_endpoint[:endpoint].split('/')[2]
    headers['Access-Control-Allow-Credentials'] = 'true'
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @sparql_endpoint }
      format.js
    end
  end

  # GET /sparql_endpoints/new
  # GET /sparql_endpoints/new.json
  def new
    @sparql_endpoint = SparqlEndpoint.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @sparql_endpoint }
      format.js
    end
  end

  # GET /sparql_endpoints/1/edit
  def edit
    @sparql_endpoint = SparqlEndpoint.find(params[:id])
  end

  # POST /sparql_endpoints
  # POST /sparql_endpoints.json
  def create
    @sparql_endpoint = SparqlEndpoint.new(params[:sparql_endpoint])

    respond_to do |format|
      if @sparql_endpoint.save
        format.html { redirect_to @sparql_endpoint, notice: 'Sparql query was successfully created.' }
        format.json { render json: @sparql_endpoint, status: :created, location: @sparql_endpoint }
        format.js
      else
        format.html { render action: "new" }
        format.json { render json: @sparql_endpoint.errors, status: :unprocessable_entity }
        format.js
      end
    end
  end

  # PUT /sparql_endpoints/1
  # PUT /sparql_endpoints/1.json
  def update
    @sparql_endpoint = SparqlEndpoint.find(params[:id])

    respond_to do |format|
      if @sparql_endpoint.update_attributes(params[:sparql_endpoint])
        format.html { redirect_to @sparql_endpoint, notice: 'Sparql query was successfully updated.' }
        format.json { head :no_content }
        format.js
      else
        format.html { render action: "edit" }
        format.json { render json: @sparql_endpoint.errors, status: :unprocessable_entity }
        format.js
      end
    end
  end

  # DELETE /sparql_endpoints/1
  # DELETE /sparql_endpoints/1.json
  def destroy
    @sparql_endpoint = SparqlEndpoint.find(params[:id])
    @sparql_endpoint.destroy

    respond_to do |format|
      format.html { redirect_to sparql_queries_url }
      format.json { head :no_content }
      format.js
    end
  end
end
