class SparqlEndpointsController < ApplicationController
  before_action :authenticate_user!, only: [:new, :edit, :create, :update, :destroy]
  before_action :set_sparql_endpoint, only: [:show, :edit, :update, :destroy]

  # GET /sparql_endpoints
  # GET /sparql_endpoints.json
  def index
    @sparql_endpoints = SparqlEndpoint.joins(:user).where('user_id = ?', current_user)
    @other_users_sparql_endpoints = SparqlEndpoint.select('distinct (endpoint), name').joins(:user).where('user_id != ?', current_user)
  end

  # GET /sparql_endpoints/1
  # GET /sparql_endpoints/1.json
  def show
  end

  # GET /sparql_endpoints/new
  def new
    @sparql_endpoint = SparqlEndpoint.new
  end

  # GET /sparql_endpoints/1/edit
  def edit
  end

  # POST /sparql_endpoints
  # POST /sparql_endpoints.json
  def create
    @sparql_endpoint = SparqlEndpoint.new(sparql_endpoint_params)
    @sparql_endpoint.user = current_user

    respond_to do |format|
      if @sparql_endpoint.save
        format.html { redirect_to sparql_endpoints_path, notice: 'Sparql endpoint was successfully created.' }
        format.json { render :show, status: :created, location: @sparql_endpoint }
      else
        format.html { render :new }
        format.json { render json: @sparql_endpoint.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /sparql_endpoints/1
  # PATCH/PUT /sparql_endpoints/1.json
  def update
    respond_to do |format|
      if @sparql_endpoint.update(sparql_endpoint_params)
        format.html { redirect_to sparql_endpoints_path, notice: 'Sparql endpoint was successfully updated.' }
        format.json { render :show, status: :ok, location: @sparql_endpoint }
      else
        format.html { render :edit }
        format.json { render json: @sparql_endpoint.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /sparql_endpoints/1
  # DELETE /sparql_endpoints/1.json
  def destroy
    @sparql_endpoint.destroy
    respond_to do |format|
      format.html { redirect_to sparql_endpoints_url, notice: 'Sparql endpoint was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_sparql_endpoint
      @sparql_endpoint = SparqlEndpoint.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def sparql_endpoint_params
      # params.fetch(:sparql_endpoint, {:name, :endpoint})
      params.require(:sparql_endpoint).permit(:name, :endpoint)
    end
end