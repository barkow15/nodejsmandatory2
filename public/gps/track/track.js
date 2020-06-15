var socket = io.connect('localhost:3000');

// Init empty array to hold values of incoming routecordinates
var allRouteCordinates = [];

socket.on('locations', function (locationsData) {
    let routeCordinatesAsArray = Array(locationsData.locations);
    let routeCordinates = routeCordinatesAsArray[0];

    allRouteCordinates.push(...routeCordinates);
    
    console.log(allRouteCordinates);

    if($('#map div').length <= 0 && allRouteCordinates.length > 0){
        window.gmap = initMap(allRouteCordinates);   
        //console.log(map);
        console.log(map);
        let onOffStatusIconElem = $('.on-off-status-icon span');
        if(onOffStatusIconElem.hasClass('offline')){
            onOffStatusIconElem.removeClass('offline').addClass('online').html(`Online <i class="fas fa-globe online"></i>`);
        }
    }else{

        // get existing path
        var path = gmap.routePath.getPath().getArray();

/*         for(let [key, value] of allRouteCordinates){
            path.push(new google.maps.LatLng(value.lat, value.lng));
            console.log(value);
        } */
        
        console.log(path);

        Object.keys(allRouteCordinates).forEach( (key) => {
            let route = allRouteCordinates[key];
            path.push(new google.maps.LatLng(route.lat, route.lng));
//            path.push(new google.maps.LatLng(value.lat, value.lng));
            console.log(route.lat); 
        });


        console.log(path);

        // update the polyline with the updated path
        gmap.routePath.setPath(path);

        gmap.routePath.setMap(gmap.map);
    }
});

function initMap(routeCoordinates) {
    let routeCordsLastItemIndex = routeCoordinates.length -1;

    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: routeCoordinates[routeCordsLastItemIndex],
        mapTypeId: 'terrain'
    });

    const routePath = new google.maps.Polyline({
        path: routeCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    routePath.setMap(map);

    return {map, routePath};
}