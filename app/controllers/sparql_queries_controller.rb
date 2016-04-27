class SparqlQueriesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_sparql_query, only: [:edit, :update, :destroy]

  # GET /sparql_queries
  # GET /sparql_queries.json
  def index
    # current user's root sparql queries
    @sparql_queries = SparqlQuery.joins(:user).where('user_id = ? AND parent_query_id IS NULL', current_user).order('updated_at DESC').page(params[:my_queries]).per_page(15)
    @other_users_sparql_queries = SparqlQuery.joins(:user).where('user_id != ? AND parent_query_id IS NULL', current_user).order('updated_at DESC').page(params[:not_my_queries]).per_page(15)
  end

  # GET /sparql_queries/1
  # GET /sparql_queries/1.json
  def show
    # includes root query
    @sparql_queries = find_all_child_queries(params[:id])

    # used for new query form
    @sparql_query = SparqlQuery.new
    @sparql_endpoint = SparqlEndpoint.new
    @sparql_endpoints = SparqlEndpoint.joins(:user).where('user_id = ?', current_user)
  end

  # GET /sparql_queries/new
  def new
    @sparql_query = SparqlQuery.new
    @sparql_endpoints = SparqlEndpoint.joins(:user).where('user_id = ?', current_user)
  end

  # GET /sparql_queries/1/edit
  def edit
    @sparql_endpoints = SparqlEndpoint.joins(:user).where('user_id = ?', current_user)
  end

  # POST /sparql_queries
  # POST /sparql_queries.json
  def create
    @sparql_query = SparqlQuery.new(sparql_query_params)
    @sparql_query.user_id = current_user.id

    # redirect to the root sparql_query
    @redirect_target = set_redirect_target(@sparql_query)

    respond_to do |format|
      if @sparql_query.save
        format.html { redirect_to @redirect_target, notice: 'Sparql endpoint was successfully created.' }
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

    # redirect to the root sparql_query
    @redirect_target = set_redirect_target(@sparql_query)

    respond_to do |format|
      if @sparql_query.update(sparql_query_params)
        format.html { redirect_to @redirect_target, notice: 'Sparql query was successfully updated.' }
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

    # redirect to the root sparql_query
    @redirect_target = set_redirect_target(@sparql_query)

    # if the query to delete is the root, redirect to index.html.erb
    if @redirect_target == @sparql_query
      @redirect_target = sparql_queries_url
    end

    ######################################
    # currently set to cascade on delete #
    ######################################
    
    # if deleting an intermedidate query, 
    # update parent_query_id for child queries
    # if @sparql_query.childQueries.size > 0 
    #   @parent_id = @sparql_query.parent_query_id

    #   @sparql_query.childQueries.each do |query|
    #     query.parent_query_id = @parent_id
    #   end
    # end

    #@sparql_query.childQueries.first.parent_query_id = @sparql_query.parent_query_id

    @sparql_query.destroy
    respond_to do |format|
      format.html { redirect_to @redirect_target, notice: 'Sparql query was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_sparql_query
      @sparql_query = SparqlQuery.find(params[:id])
    end

    def sparql_query_params
      params.require(:sparql_query).permit(:name, :query, :sparql_endpoint_id, :parent_query_id)
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

    # used to redirect to the root sparql_query
    def set_redirect_target(s_query)
      @root_query = s_query
      while @root_query.parent_query_id != nil do
        @root_query = @root_query.parentQuery 
      end

      # return the root query
      @root_query
    end
end
