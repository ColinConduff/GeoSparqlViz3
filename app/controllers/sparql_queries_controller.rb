class SparqlQueriesController < ApplicationController
	
  before_action :authenticate_user!

  # GET /sparql_queries
  # GET /sparql_queries.json
  def index
    @sparql_queries = SparqlQuery.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @sparql_queries }
      format.js
    end
  end

  # GET /sparql_queries/1
  # GET /sparql_queries/1.json
  def show
    @sparql_query = SparqlQuery.find(params[:id])
    
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @sparql_query }
      format.js
    end
  end

  # GET /sparql_queries/new
  # GET /sparql_queries/new.json
  def new
    @sparql_query = SparqlQuery.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @sparql_query }
      format.js
    end
  end

  # GET /sparql_queries/1/edit
  def edit
    @sparql_query = SparqlQuery.find(params[:id])
  end

  # POST /sparql_queries
  # POST /sparql_queries.json
  def create
    @sparql_query = SparqlQuery.new(params[:sparql_query])

    respond_to do |format|
      if @sparql_query.save
        format.html { redirect_to @sparql_query, notice: 'Sparql query was successfully created.' }
        format.json { render json: @sparql_query, status: :created, location: @sparql_query }
        format.js
      else
        format.html { render action: "new" }
        format.json { render json: @sparql_query.errors, status: :unprocessable_entity }
        format.js
      end
    end
  end

  # PUT /sparql_queries/1
  # PUT /sparql_queries/1.json
  def update
    @sparql_query = SparqlQuery.find(params[:id])

    respond_to do |format|
      if @sparql_query.update_attributes(params[:sparql_query])
        format.html { redirect_to @sparql_query, notice: 'Sparql query was successfully updated.' }
        format.json { head :no_content }
        format.js
      else
        format.html { render action: "edit" }
        format.json { render json: @sparql_query.errors, status: :unprocessable_entity }
        format.js
      end
    end
  end

  # DELETE /sparql_queries/1
  # DELETE /sparql_queries/1.json
  def destroy
    @sparql_query = SparqlQuery.find(params[:id])
    @sparql_query.destroy

    respond_to do |format|
      format.html { redirect_to sparql_queries_url }
      format.json { head :no_content }
      format.js
    end
  end
end
