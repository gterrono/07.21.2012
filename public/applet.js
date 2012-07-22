MapApplet = (function(){
    var loc, map;
    var curOverlay = undefined;

    function init() {

	loc = new google.maps.LatLng(37.762861, -122.401078);
	var mapOptions = {
            center: loc,
            zoom: 16,
            //mapTypeId: google.maps.MapTypeId.HYBRID
            mapTypeId: google.maps.MapTypeId.ROADMAP
            //mapTypeId: google.maps.MapTypeId.SATELLITE
            //mapTypeId: google.maps.MapTypeId.TERRAIN
	};

	map = new google.maps.Map($("#crazy-map")[0], mapOptions);
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
	s += '<div id="overlay-user">User: '+placeData.user+'</div>';
	s += '<div id="overlay-fee">Delivery Fee: $'+placeData.fee+'</div>';
	s += '<a style="cursor: pointer" onClick="javascript:order_up('+placeData.id+')">Order Up</a></td>';
	//s += '<a href="requests/new?id='+placeData.id+'">Order Up</a>';
	s += '</div>';
	return s;
    }

    return {
	init: init,
	addLocation: addLocation
    };
})();


function order_up(id){
    $("#modal-user").val(user_id);
    $("#modal-checkin").val(id);
    $("#myModal").modal('show');
    //post_to_url('requests/new', {id: id, user: user_id}, "get");
}

function submit_order(){
    $("#myModal").modal('hide');
    var post_data = {
	user: $("#modal-user").val(),
	check_in: $("#modal-checkin").val(),
	order: $("#modal-order").val(),
	details: $("#modal-details").val(),
	payment: $("#modal-payment").val()
    };

    post_to_url('requests', post_data);
}

function post_to_url(path, params, method) {
    method = method || "post"; // Set method to post by default, if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}

function getTime(){
    return Math.floor(new Date().getTime()/1000);
}

function update_time_staying_counters(){
    var time = getTime();
    for(var i in data){
	var checkin = data[i];
	var $elem = $("#time-staying-id"+checkin.id);
	var timeLeft = (checkin.posted + checkin.time_staying) - time;
	if(timeLeft < 0){
	    $("#check-in-id"+checkin.id).fadeOut(20);
	} else {
	    var s = new Date(timeLeft*1000).toTimeString().substring(0,8)
	    $elem.html(s);
	}
    }
}

function dispatch_checkins_request(){
    $.ajax({url:'check_ins.json', 
	    contentType: 'text/json', 
	    success: checkins_request_success,
	    failure: function(errMsg){
		console.log("Request Failed", errMsg);
	    }});
}

function checkins_request_success(response){
    console.log("Response Success", response);
    var html = [];
    for(var i in response){
	if(checkin_valid(response[i]))
	    html.push(generate_checkin_listing(response[i]));
    }
    $("#checkins").html(html.join(''));
    update_time_staying_counters();
}

String.prototype.format = function() {
    var formatted = this;
    for(arg in arguments) {
        formatted = formatted.replace("{" + arg + "}", arguments[arg]);
    }
    return formatted;
};

function generate_checkin_listing(checkin){
   var listing = '<div id="check-in-id{0}" class="newsfeed-item">'
	+ '<div id="table-div">'
	+ '<table class="table">'
	+ '<tr>'
	+ '<td>{1} is at {2}</td>'
	+ '</tr>'
	+ '<tr>'
	+ '<td id="time-staying-id{0}"></td>'
	+ '<td>${3}</td>'
	+ '<td><button class="btn btn-primary order-button" data-toggle="modal" onClick="javascript:order_up({1})">OrderUp</button></td>'
	+ '</tr>'
	+ '</table>'
	+ '</div>'
	+ '</div>';

    return listing.format(checkin.id, checkin.user, checkin.name, checkin.fee);
}

function checkin_valid(checkin){
    var time = getTime();
    var timeLeft = (checkin.posted + checkin.time_staying) - time;
    return timeLeft >= 0;
}

window.onload = function(){
    //$("#myModal").modal({backdrop: true});
    update_time_staying_counters();
    setInterval(update_time_staying_counters, 1000);
    setInterval(dispatch_checkins_request, 2000);
    MapApplet.init()
    for(var i in data){
	MapApplet.addLocation(data[i]);
    }
}
