Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  # Default routing by resources
  resources :roman_numeral_converter, :tic_tac_toe, :house_hunter

  # Default Rails Route - Catch All - Should be last - DEPRECATED
  # match ':controller(/:action(/:id(.:format)))', :via => [:get, :post]
end
