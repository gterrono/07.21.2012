MapApplet = (function(){
    var loc, map;
    var curOverlay = undefined;

    function init() {
	loc = new google.maps.LatLng(37.762861, -122.401078);
	var mapOptions = {
            center: loc,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.HYBRID
            //mapTypeId: google.maps.MapTypeId.ROADMAP
            //mapTypeId: google.maps.MapTypeId.SATELLITE
            //mapTypeId: google.maps.MapTypeId.TERRAIN
	};

	map = new google.maps.Map($("#map_canvas")[0], mapOptions);
    }

    function addLocation(placeData){
	var loc = new google.maps.LatLng(placeData.lat, placeData.lon);
	var loc_off = new google.maps.LatLng(placeData.lat+0.0006, placeData.lon);
	var opts = {
	    position: loc,
	    map: map,
	    title: placeData.name
	};
	var overlay = new google.maps.InfoWindow({
	    content: computeOverlayContent(placeData),
	    position: loc_off
	});
	var marker = new google.maps.Marker(opts);
	google.maps.event.addListener(marker, 'click', function(){openOverlay(overlay)});
    }

    function openOverlay(overlay){
	closeOverlays();
	overlay.open(map);
	curOverlay = overlay;
    }

    function closeOverlays(){
	if(curOverlay)
	    curOverlay.close();
	curOverlay = undefined;
    }

    function computeOverlayContent(placeData){
	var s = '<div class="overlay">';
	s += '<div id="overlay-title">'+placeData.name+'</div>';
	s += '<a href="order?id='+placeData.id+'">Place Order</a>';
	s += '</div>';
	return s;
    }

    return {
	init: init,
	addLocation: addLocation
    };
})();


window.onload = function(){
    MapApplet.init()
    for(var i in data){
	MapApplet.addLocation(data[i]);
    }
}
