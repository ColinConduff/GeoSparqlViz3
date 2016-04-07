Rails.application.routes.draw do
  devise_for :users
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".
  
  # creates browse_path
  # used by devise after log in
  get '/browser' => 'browser#index', as: :browser
  get '/visualizer' => 'visualizer#index', as: :visualizer 
  
  get '/editor/:id/edit' => 'editor#edit', as: :edit_root_query 
  # put '/editor/:id' => 'editor#updateRootQuery', as: :update_root_query

  get '/editor/new' => 'editor#new', as: :new_root_query
  # post '/editor' => 'editor#createRootQuery', as: :create_root_query

  # You can have the root of your site routed with "root"
  root to: 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  resources :sparql_endpoints, controller: 'sparql_endpoints'
  resources :sparql_queries, controller: 'sparql_queries'

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
