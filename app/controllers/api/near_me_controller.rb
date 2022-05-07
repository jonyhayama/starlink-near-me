# frozen_string_literal: true

module Api
  class NearMeController < ApplicationController # rubocop:disable Style/Documentation
    # /api/near-me?lat=40.700006352618544&lon=-74.04903955504285&qty=3
    def index
      @satellites = Starlink.near_me(*index_params)
      expires_in 15.minutes, public: true
    end

    private

    def index_params
      [params[:lat].to_f, params[:lon].to_f, params[:qty].to_i]
    end
  end
end
