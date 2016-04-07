class EditorController < ApplicationController
  
  # GET /editor/new
  # GET /editor/new.json
  def new
    @sparql_query = SparqlQuery.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @sparql_query }
      format.js
    end
  end

  # GET /editor/1/edit
  def edit
    @sparql_query = SparqlQuery.find(params[:id])
  end

  # used for editor
  # def newRootQuery
  #   @sparql_query = SparqlQuery.new

  #   respond_to do |format|
  #     format.html # new.html.erb
  #     format.json { render json: @sparql_query }
  #     format.js
  #   end
  # end

  # # used for editor
  # def createRootQuery
  #   @sparql_query = SparqlQuery.new(query_params)
  #   @sparql_query.user_id = current_user.id

  #   respond_to do |format|
  #     if @sparql_query.save
  #       format.html { redirect_to @sparql_query, notice: 'Sparql query was successfully created.' }
  #       format.json { render json: @sparql_query, status: :created, location: @sparql_query }
  #       format.js
  #     else
  #       format.html { render action: "new" }
  #       format.json { render json: @sparql_query.errors, status: :unprocessable_entity }
  #       format.js
  #     end
  #   end
  # end
end