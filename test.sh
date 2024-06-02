#!/bin/bash

# Test API status
echo "Testing API status..."
curl -X GET http://0.0.0.0:5001/api/v1/status/
echo

# Test fetching all places
echo "Fetching all places..."
curl -X POST http://0.0.0.0:5001/api/v1/places_search/ -H "Content-Type: application/json" -d '{}'
echo

# Test filtering places by amenities
echo "Filtering places by amenities..."
curl -X POST http://0.0.0.0:5001/api/v1/places_search/ -H "Content-Type: application/json" -d '{"amenities": ["amenity_id_1", "amenity_id_2"]}'
echo

# Test home page
echo "Fetching home page..."
curl -X GET http://0.0.0.0:5000/4-hbnb/
echo

# Check API status indicator in home page
echo "Checking API status indicator in home page..."
curl -X GET http://0.0.0.0:5000/4-hbnb/ | grep 'id="api_status"'
echo
