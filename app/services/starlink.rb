# frozen_string_literal: true

# Handles Starlink API Calls
class Starlink
  # NOTE: Caching the endpoint data into a file might not be the best approach, but I'll work for now :)
  CACHE_FILENAME = 'tmp/satellites.json'
  CACHE_FILE_FOR = 60.minutes

  class << self
    # Starlink.near_me(40.700006352618544, -74.04903955504285, 3)
    def near_me(lat, lon, qty)
      raw = fetch_satellites
      satellites = raw.each_with_object({}).with_index do |(satellite, obj), index|
        if satellite['latitude'] && satellite['longitude']
          distance = Haversine.distance(lat, lon, satellite['latitude'].to_f, satellite['longitude'].to_f).to_m
          obj[distance] = { index: index, id: satellite['id'] }
        end
      end.sort.to_h

      satellites.first(qty).map { |sat| { satellite: raw[sat.last[:index]], distance: sat.first } }
    end

    def fetch_satellites
      if cached_file?
        Oj.load(File.read(CACHE_FILENAME))
      else
        response = HTTParty.get('https://api.spacexdata.com/v4/starlink')
        File.write(CACHE_FILENAME, response.body)

        Oj.load(response.body)
      end
    end

    def cached_file?
      File.exist?(CACHE_FILENAME) && (Time.current - File.mtime(CACHE_FILENAME)) / 1 < CACHE_FILE_FOR
    end
  end
end
