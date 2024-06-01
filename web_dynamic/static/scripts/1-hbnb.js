$(document).ready(function() {
    let selectedAmenities = {};

    $('input[type="checkbox"]').change(function() {
        if (this.checked) {
            selectedAmenities[$(this).data('id')] = $(this).data('name');
        } else {
            delete selectedAmenities[$(this).data('id')];
        }
        updateAmenities();
    });

    function updateAmenities() {
        let amenitiesList = Object.values(selectedAmenities).join(', ');
        if (amenitiesList.length === 0) {
            amenitiesList = '&nbsp;';
        }
        $('div.amenities h4').html(amenitiesList);
    }
});
