class SparqlQueriesController < ApplicationController
  before_action :authenticate_user!, only: [:new, :edit, :create, :update, :destroy]
  before_action :set_sparql_query, only: [:edit, :destroy]
  add_flash_types :query_checked, :syntax_error_message, :no_errors_found_message

  # GET /sparql_queries
  # GET /sparql_queries.json
  def index
    # current user's root sparql queries
    @sparql_queries = SparqlQuery.joins(:user).where('user_id = ? AND parent_query_id IS NULL', current_user).order('updated_at DESC').page(params[:my_queries]).per_page(15)
    @other_users_sparql_queries = SparqlQuery.joins(:user).where('user_id != ? AND parent_query_id IS NULL', current_user).order('updated_at DESC').page(params[:not_my_queries]).per_page(15)
  
    if not user_signed_in?
      @not_signed_in_queries = SparqlQuery.where('parent_query_id IS NULL').page(params[:not_signed_in_queries]).per_page(15)
    end
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
  # before_action :set_sparql_query
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

    # have sparql_endpoints ready in case save fails
    @sparql_endpoints = SparqlEndpoint.joins(:user).where('user_id = ?', current_user)

    respond_to do |format|
      if @sparql_query.save
        format.html { redirect_to @redirect_target, notice: 'The sparql query was successfully created.' }
        format.json { render :show, status: :created, location: @sparql_query }
      elsif @redirect_target.id != @sparql_query.id 
        format.html { 
          redirect_to @redirect_target, 
          alert: 'Failed to update the sparql query. A name (min size: 3, max size: 150), query (min size: 3, max size: 2000), and endpoint must be present.'
        }
        format.json { render json: @sparql_query.errors, status: :unprocessable_entity }
      else
        format.html { render :action => "new" } 
        format.json { render json: @sparql_query.errors, status: :unprocessable_entity }
      end
    end
  end

  # Dependencies for the parser function
  require 'rubygems'
  require 'sparql'

  # PATCH/PUT /sparql_queries/1
  # PATCH/PUT /sparql_queries/1.json
  # Checks the syntax of a sparql query using the sparql gem
  # Documentation at: http://www.rubydoc.info/github/ruby-rdf/sparql/frames
  def update
    @query_to_check = SparqlQuery.find(params[:id])

    if @query_to_check.update(sparql_query_params)
      @successful_update = true
    else
      @successful_update = false
    end

    # Replace bracket statements with something that will not 
    # throw errors when checking the syntax of the query
    query_without_bracket_statements = @query_to_check.query.gsub(/\[\[.*\]\]/, 'ignoreThis')

    # If the parse function finds a syntax error
    # it is stored in @error_message
    begin 
      # The following function parses the query into SSE (abstract query algebra)
      # however it is only being used to find syntax errors
      sse = SPARQL.parse(query_without_bracket_statements)
    rescue => e
      @error_message = e.message
    else 
      @error_message = nil 
    end 

    # redirect to the root sparql_query
    @redirect_target = set_redirect_target(@query_to_check)

    # used for new query form
    @sparql_query = SparqlQuery.new
    @sparql_endpoint = SparqlEndpoint.new
    @sparql_endpoints = SparqlEndpoint.joins(:user).where('user_id = ?', current_user)

    respond_to do |format|
      if @successful_update and !@error_message
        format.html { 
          redirect_to @redirect_target, 
          notice: 'Sparql query was successfully updated.', 
          query_checked: @query_to_check.id, # Used to find the query again in the view
          no_errors_found_message: 'Sparql Syntax Check: No errors were found'
        }
        format.json { render :show, status: :ok, location: @sparql_query }
      elsif @successful_update and @error_message
        format.html { 
          redirect_to @redirect_target, 
          notice: 'Sparql query was successfully updated.', 
          query_checked: @query_to_check.id, 
          syntax_error_message: @error_message 
        } 
        format.json { render :show, status: :ok, location: @sparql_query }
      else
        format.html { 
          redirect_to @redirect_target, 
          alert: 'Failed to update the sparql query. A name (min size: 3, max size: 150), query (min size: 3, max size: 2000), and endpoint must be present.'
        }
        format.json { render json: @sparql_query.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /sparql_queries/1
  # DELETE /sparql_queries/1.json
  # before_action :set_sparql_query
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

  # Duplicates a sparql query
  # May create a new sparql endpoint if the target user does not already
  # have the associated endpoint
  def clone 
    # includes root query
    @original_queries = find_all_child_queries(params[:id])

    # Used for redirect on fail
    @original_root_query = SparqlQuery.find(params[:id])

    @failure_message = 'Failed to clone sparql query because of the following: '

    # If the user doesn't have the endpoint already, create a new one for them
    @first_endpoint = SparqlEndpoint.joins(:user).where(
      'user_id = ? AND endpoint = ?', 
      current_user, 
      @original_queries.first.sparqlEndpoint.endpoint
      ).first

    if not @first_endpoint
      @first_endpoint = SparqlEndpoint.create(
                 name: @original_queries.first.sparqlEndpoint.name,
                 endpoint: @original_queries.first.sparqlEndpoint.endpoint,
                 user: current_user)
    end

    # Create a new root query
    @new_root_query = SparqlQuery.new(
      user: current_user,
      name: @original_queries.first.name + " Duplicate", 
      query: @original_queries.first.query,
      sparqlEndpoint: @first_endpoint
    )

    # If the new root query fails to save 
    # redirect to the original root query
    if @new_root_query.save
      @clone_successful = true

      # Skip the first query when cloning the queries 
      # in the original queries array
      @previous_query = @new_root_query
      @original_queries.drop(1).each do |original_query|
        # If the user doesn't have the endpoint already, create a new one for them
        @endpoint = SparqlEndpoint.joins(:user)
                         .where('user_id = ? AND endpoint = ?', 
                                current_user, 
                                original_query.sparqlEndpoint.endpoint).first

        if not @endpoint
          @endpoint = SparqlEndpoint.create(
                     name: original_query.sparqlEndpoint.name,
                     endpoint: original_query.sparqlEndpoint.endpoint,
                     user: current_user)
        end

        @new_query = SparqlQuery.new(
          user: current_user,
          name: original_query.name + " Duplicate", 
          query: original_query.query,
          sparqlEndpoint: @endpoint,
          parentQuery: @previous_query
        )
        if not @new_query.save
          @failure_message = @failure_message + ', failed to create a query named [' + original_query.name + ']'
          @clone_successful = false
          break
        end

        @previous_query = @new_query
      end
    else 
      @clone_successful = false
      @failure_message = @failure_message + 'failed to create a new root query'
    end

    # used for new query form
    @sparql_query = SparqlQuery.new
    @sparql_endpoint = SparqlEndpoint.new
    @sparql_endpoints = SparqlEndpoint.joins(:user).where('user_id = ?', current_user)

    respond_to do |format|
      if @clone_successful
        format.html { redirect_to @new_root_query, notice: 'The sparql query was successfully cloned.' } 
        format.json { head :no_content }
      else 
        format.html { redirect_to @original_root_query, alert: @failure_message}
        format.json { render json: @sparql_query.errors, status: :unprocessable_entity }
      end
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
