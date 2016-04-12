class SparqlQueriesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_sparql_query, only: [:show, :edit, :update, :destroy]

  # GET /sparql_queries
  # GET /sparql_queries.json
  def index
    # current user's root sparql queries
    @sparql_queries = SparqlQuery.joins(:user).where('user_id = ? AND parent_query_id IS NULL', current_user)
  end

  # GET /sparql_queries/1
  # GET /sparql_queries/1.json
  def show
    @sparql_queries = find_all_child_queries(params[:id])
  end

  # GET /sparql_queries/new
  def new
    @sparql_query = SparqlQuery.new
  end

  # GET /sparql_queries/1/edit
  def edit
    @sparql_endpoints = SparqlEndpoint.joins(:user).where('user_id = ?', current_user)
    @parent_queries = SparqlQuery.joins(:user).where('user_id = ?', current_user)
  end

  # POST /sparql_queries
  # POST /sparql_queries.json
  def create
    @sparql_query = SparqlQuery.new(sparql_query_params)
    @sparql_query.user_id = current_user.id

    respond_to do |format|
      if @sparql_query.save
        format.html { redirect_to @sparql_query, notice: 'Sparql endpoint was successfully created.' }
        format.json { render :show, status: :created, location: @sparql_query }
      else
        format.html { render :new }
        format.json { render json: @sparql_query.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /sparql_queries/1
  # PATCH/PUT /sparql_queries/1.json
  def update
    respond_to do |format|
      if @sparql_query.update(sparql_query_params)
        format.html { redirect_to @sparql_query, notice: 'Sparql query was successfully updated.' }
        format.json { render :show, status: :ok, location: @sparql_query }
      else
        format.html { render :edit }
        format.json { render json: @sparql_query.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /sparql_queries/1
  # DELETE /sparql_queries/1.json
  def destroy
    @sparql_query.destroy
    respond_to do |format|
      format.html { redirect_to sparql_queries_url, notice: 'Sparql query was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_sparql_query
      @sparql_query = SparqlQuery.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def sparql_query_params
      params.fetch(:sparql_query, {})
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
end
