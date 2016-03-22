# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )

# Rails.application.config.assets.precompile += %w( codeMirrorHopscotch.css )
Rails.application.config.assets.precompile += %w( manifest/home.js )
Rails.application.config.assets.precompile += %w( manifest/sparqlQueries/form.js )
Rails.application.config.assets.precompile += %w( manifest/sparqlQueries/general.js )
Rails.application.config.assets.precompile += %w( manifest/sparqlQueries/showAll.js )
Rails.application.config.assets.precompile += %w( manifest/sparqlQueries/showOne.js )
# Rails.application.config.assets.precompile += %w( jquery.js )
# Rails.application.config.assets.precompile += %w( bootstrap.js )
# Rails.application.config.assets.precompile += %w( proj4js.js )
# Rails.application.config.assets.precompile += %w( OpenLayers/OpenLayers.js )
# Rails.application.config.assets.precompile += %w( OpenLayers/OpenLayers.debug.js )
# Rails.application.config.assets.precompile += %w( jquery.simplePagination.js )
# Rails.application.config.assets.precompile += %w( codemirror.js )
# Rails.application.config.assets.precompile += %w( codemirror/modes/sparql.js )

# # Some of these may no longer be necessary
# Rails.application.config.assets.precompile += %w( sparql_queries.form.js )
# Rails.application.config.assets.precompile += %w( sparql_queries.index.js )

# Rails.application.config.assets.precompile += %w( home.map.js )
# Rails.application.config.assets.precompile += %w( home.index.js )
# Rails.application.config.assets.precompile += %w( home.queries.js )
