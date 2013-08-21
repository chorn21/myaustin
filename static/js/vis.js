$(function() {
    var checkins = [];
    var mapOptions = {
        center: new google.maps.LatLng(30.25, -97.75),
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);

    $.getJSON('https://api.foursquare.com/v2/users/self/checkins?oauth_token=TGBSJSVQJRHTWZORDFSIMDXVH0CG0ID02CROMXSGUDPZTAMJ&afterTimestamp=1368295200&beforeTimestamp=1376935200&limit=250&sort=newestfirst', function(data) {
        $.each(data.response.checkins.items, function(num, val) {
            checkins.push(val.venue);
        });
        $.getJSON('https://api.foursquare.com/v2/users/self/checkins?oauth_token=TGBSJSVQJRHTWZORDFSIMDXVH0CG0ID02CROMXSGUDPZTAMJ&beforeTimestamp=1372129941&afterTimestamp=1368295200&limit=250&sort=newestfirst', function(data) {
            $.each(data.response.checkins.items, function(num, val) {
                checkins.push(val.venue);
            });

            var places = processCheckins(checkins);
            console.log("places is", places);
            $.each(places, function(name, place) {
                var circleOptions = {
                    center: new google.maps.LatLng(place.lat, place.lng),
                    map: map,
                    radius: place.numCheckins*2,
                    strokeColor: 'red',
                    fillColor: 'red',
                    fillOpacity: 1.0
                };
                var circle = new google.maps.Circle(circleOptions);
            })
        });
    });

    function initialize() {
    }

    google.maps.event.addDomListener(window, 'load', initialize);

    // create an object with Places objects, using the place names as the keys
    // returns the object with Places
    function processCheckins(array) {
        var places = {};
        $.each(array, function(i, val) {
            if(val) {
                if(!places[val.name]) {
                    var place = new Place(val.name, val.location.lat, val.location.lng, val.location.address, 1);
                    places[val.name] = place;
                }
                else {
                    places[val.name].numCheckins++;
                }
            }
        });
        return places;
    }

});

function Place(name, lat, lng, address, numCheckins) {
    this.name = name;
    this.lat = lat;
    this.lng = lng;
    this.address = address;
    this.numCheckins = numCheckins;
}
