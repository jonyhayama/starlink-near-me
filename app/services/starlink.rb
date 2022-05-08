# frozen_string_literal: true

# Handles Starlink API Calls
class Starlink
  # NOTE: Caching the endpoint data into a file might not be the best approach, but I'll work for now :)
  CACHE_FILENAME = 'tmp/satellites.json'
  CACHE_FILE_FOR = 60.minutes

  class << self
    # Starlink.near_me(40.700006352618544, -74.04903955504285, 3)
    def near_me(lat, lng, qty)
      dictionary(lat, lng).first(qty).map do |item|
        { satellite: satellites[item.last[:index]], distance: item.first }
      end
    end

    private

    def dictionary(lat, lng)
      satellites.each_with_object({}).with_index do |(satellite, obj), index|
        if satellite['latitude'] && satellite['longitude']
          distance = Haversine.distance(lat, lng, satellite['latitude'].to_f, satellite['longitude'].to_f).to_m
          obj[distance] = { index: index, id: satellite['id'] }
        end
      end.sort.to_h
    end

    def satellites
      return @satellites if @satellites.present?

      if cached_file?
        @satellites = Oj.load(File.read(CACHE_FILENAME))
      else
        response = HTTParty.get('https://api.spacexdata.com/v4/starlink')
        File.write(CACHE_FILENAME, response.body)

        @satellites = Oj.load(response.body)
      end
    end

    def cached_file?
      File.exist?(CACHE_FILENAME) && (Time.current - File.mtime(CACHE_FILENAME)) / 1 < CACHE_FILE_FOR
    end
  end
end
