# frozen_string_literal: true

json.array! @satellites do |data|
  json.extract! data[:satellite], 'id', 'latitude', 'longitude'
  json.distance data[:distance]
end
