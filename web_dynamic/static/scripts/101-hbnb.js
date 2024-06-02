$(document).ready(function() {
    $.get('http://0.0.0.0:5001/api/v1/status/', function(data) {
        if (data.status === 'OK') {
            $('#api_status').addClass('available');
        } else {
            $('#api_status').removeClass('available');
        }
    });

    let selectedAmenities = {};
    let selectedStates = {};
    let selectedCities = {};

    $('input[type="checkbox"]').change(function() {
        if (this.checked) {
            if ($(this).data('id').startsWith('state')) {
                selectedStates[$(this).data('id')] = $(this).data('name');
            } else if ($(this).data('id').startsWith('city')) {
                selectedCities[$(this).data('id')] = $(this).data('name');
            } else {
                selectedAmenities[$(this).data('id')] = $(this).data('name');
            }
        } else {
            if ($(this).data('id').startsWith('state')) {
                delete selectedStates[$(this).data('id')];
            } else if ($(this).data('id').startsWith('city')) {
                delete selectedCities[$(this).data('id')];
            } else {
                delete selectedAmenities[$(this).data('id')];
            }
        }
        updateSelections();
    });

    function updateSelections() {
        let statesList = Object.values(selectedStates).join(', ');
        let citiesList = Object.values(selectedCities).join(', ');
        let amenitiesList = Object.values(selectedAmenities).join(', ');

        if (statesList.length === 0) statesList = '&nbsp;';
        if (citiesList.length === 0) citiesList = '&nbsp;';
        if (amenitiesList.length === 0) amenitiesList = '&nbsp;';

        $('div.locations h4').html(statesList + ' ' + citiesList);
        $('div.amenities h4').html(amenitiesList);
    }

    function fetchPlaces(filters) {
        $.ajax({
            url: 'http://0.0.0.0:5001/api/v1/places_search/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(filters),
            success: function(data) {
                $('.places').empty();
                for (let place of data) {
                    $('.places').append(
                        `<article>
                            <div class="title_box">
                                <h2>${place.name}</h2>
                                <div class="price_by_night">$${place.price_by_night}</div>
                            </div>
                            <div class="information">
                                <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                                <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                                <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
                            </div>
                            <div class="description">${place.description}</div>
                            <div class="reviews">
                                <h2>Reviews</h2> <span class="show-reviews">show</span>
                                <div class="review-list"></div>
                            </div>
                        </article>`
                    );
                }

                $('.show-reviews').click(function() {
                    const span = $(this);
                    const reviewList = span.siblings('.review-list');

                    if (span.text() === 'show') {
                        // Fetch and display reviews
                        const placeId = span.closest('article').data('id');
                        $.get(`http://0.0.0.0:5001/api/v1/places/${placeId}/reviews`, function(reviews) {
                            reviewList.empty();
                            for (let review of reviews) {
                                reviewList.append(
                                    `<div class="review">
                                        <h3>From ${review.user.first_name} ${review.user.last_name}</h3>
                                        <p>${review.text}</p>
                                    </div>`
                                );
                            }
                            span.text('hide');
                        });
                    } else {
                        // Hide reviews
                        reviewList.empty();
                        span.text('show');
                    }
                });
            }
        });
    }

    $('#search').click(function() {
        fetchPlaces({
            amenities: Object.keys(selectedAmenities),
            states: Object.keys(selectedStates),
            cities: Object.keys(selectedCities)
        });
    });

    // Initial fetch of places
    fetchPlaces({});
});
