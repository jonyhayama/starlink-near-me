# frozen_string_literal: true

Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  namespace :api, defaults: { format: :json } do
    get 'near-me', to: 'near_me#index'
  end

  # Defines the root path route ("/")
  # root "articles#index"
end
