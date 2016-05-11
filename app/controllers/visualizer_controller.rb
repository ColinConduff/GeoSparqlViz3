class VisualizerController < ApplicationController
	
	def index
		@sparql_queries = find_all_child_queries(params[:id])
	end

	private 

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