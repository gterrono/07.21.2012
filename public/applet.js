MapApplet = (function(){
    var loc, map;
    var markers = {};
    var curOverlay = undefined;
    var m;

    function init() {

	loc = new google.maps.LatLng(37.762861, -122.442078);
	var mapOptions = {
            center: loc,
            zoom: 13,
	    panControl: true,
            //mapTypeId: google.maps.MapTypeId.HYBRID
            mapTypeId: google.maps.MapTypeId.ROADMAP
            //mapTypeId: google.maps.MapTypeId.SATELLITE
            //mapTypeId: google.maps.MapTypeId.TERRAIN
	};

	map = new google.maps.Map($("#crazy-map")[0], mapOptions);
	// m = new google.maps.Marker({
	//     position: loc,
	//     map: map,	    
	//     title: "Your Location",
	//     shape: {type: 'circle'}
	// });
    }

    function addLocation(placeData){
	var loc = new google.maps.LatLng(placeData.lat, placeData.lon);
	var loc_off = new google.maps.LatLng(placeData.lat+0.00000, placeData.lon);
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
	markers[placeData.id] = marker;
    }

    function focusOn(placeData){
	map.panTo(new google.maps.LatLng(placeData.lat+0, placeData.lon+0));
	google.maps.event.trigger(markers[placeData.id], 'click');
    }

    function placeAllMarkers(data){
	for(var i in data){
	    MapApplet.addLocation(data[i]);
	}
    }

    // function clearAllMarkers(){
    // 	for(var i in markers){
    // 	    markers[i].setMap(null);
    // 	}
    // 	markers = []; reset it
    // }

    function updateMarkers(newMarkerData){
	var oldMarkers = $.extend({}, markers);
	var newMarkers = [];
	for(var i in newMarkerData){
	    var markerData = newMarkerData[i];
	    if(oldMarkers[markerData.id]){
		delete oldMarkers[markerData.id];
	    } else {
		newMarkers.push(markerData);
	    }
	}
	
	// remove old markers
	for(var key in oldMarkers){
            if(oldMarkers.hasOwnProperty(key)){
		removeMarker(key);
	    }
	}

	// add new markers
	for(var i in newMarkers){
	    addLocation(newMarkers[i]);
	}

    }

    function removeMarker(id){
	markers[id].setMap(null);
	delete markers[id];
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
	addLocation: addLocation,
	updateMarkers: updateMarkers,
	placeAllMarkers: placeAllMarkers,
	focusOn: focusOn
    };
})();


function order_up(id){
    c = JSON.parse($('#check-in-id'+id).find('#json').html());
    $('#order').val('');
    $('#details').val('');
    $('#payment').val(c.fee);
    $('#modal-user').val(3);
    $('#modal-address').val(c.address_id);
    $("#modal-checkin").val(id);
    $('#address-name').html('<option>'+c.address_name+'</option>');
    $('#deliverer').html(c.user);
    $("#myModal").modal('show');
}

function get_response(requestId) {
    $.get('requests/'+requestId+'/responses.json', function(data){
      if(data.length<1 || data[0]===null){
        setTimeout(get_response(requestId), 3000);
      }else{
        console.log(data);
        if(data[0].accepted){
          displayNotification();
        }else{
          displayBadNotification();
        }
      }
    });
}

function submit_order(){
    $("#myModal").modal('hide');
    getNotificationPermission();
    var post_data = {
      request: {
        order: $("#order").val(),
        details: $('#details').val(),
        payment: $("#payment").val(),
        user: $("#modal-user").val(),
        check_in: $("#modal-checkin").val(),
        address: $('#modal-address').val()
      }
    };

    $.post('/requests.json', post_data, function(data){$('#notification').fadeIn(1000); get_response(data.id);});
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
	var timeLeft = (parseInt(checkin.posted) + parseInt(checkin.time_staying)) - time;
	if(timeLeft < 0){
	    $("#check-in-id"+checkin.id).fadeOut(1000);
	} else {
	    var s = new Date(timeLeft*1000).toTimeString().substring(3,8)
	    $elem.html(s);
	}
    }
}

function dispatch_checkins_request(){
    $.ajax({url:'check_ins.json', 
	    contentType: 'text/json', 
	    success: checkins_request_success,
	    failure: function(errMsg){
	    }});
}

function checkins_request_success(response){
    var html = [];
    //MapApplet.clearAllMarkers(data);
    var goodData = [];
    for(var i in response){
	if(checkin_valid(response[i])){
	    html.push(generate_checkin_listing(response[i]));
	    goodData.push(response[i]);
	}
    }
    $("#checkins").html(html.join(''));
    MapApplet.updateMarkers(goodData);
    data = response;
    update_time_staying_counters();
    for(var i in goodData){
	var placeData = goodData[i];
	var $elem = $("#check-in-id"+placeData.id);
	$elem.click((function(){
	    var placeData = goodData[i];
	    return function(){		
		MapApplet.focusOn(placeData);
	    }
	})());
    }
}

String.prototype.format = function() {
    var formatted = this;
    for(arg in arguments) {
        formatted = formatted.replace("{" + arg + "}", arguments[arg]);
    }
    return formatted;
};

function generate_checkin_listing(checkin){
   // var listing = '<div id="check-in-id{0}" class="newsfeed-item">'
   // 	+ '<div id="table-div">'
   // 	+ '<table class="table">'
   // 	+ '<tr>'
   // 	+ '<td>{1} is at {2}</td>'
   // 	+ '</tr>'
   // 	+ '<tr>'
   // 	+ '<td id="time-staying-id{3}"></td>'
   // 	+ '<td>${4}</td>'
   // 	+ '<td><button class="btn btn-primary order-button" data-toggle="modal" onClick="javascript:order_up({5})">OrderUp</button></td>'
   // 	+ '</tr>'
   // 	+ '</table>'
   // 	+ '</div>'
   // 	+ '</div>';

    var listing = '<div id="check-in-id{0}" class="newsfeed-item">'
        + '<div id="json" class="hidden">'
        + '{6}'
        + '</div>'
        + '<span class="item-title">{1} is at {2}</span>'
        + '<br>'
        + '<br>'
        + '<span class="item-text item-time" id="time-staying-id{3}"></span>'
        + '<button class="btn btn-primary order-button" data-toggle="modal" onClick="javascript:order_up({5})">OrderUp</button>'
        + '<span class="item-text item-price">${4}</span>'
        + '</div>'

    return listing.format(checkin.id, checkin.user, checkin.name, checkin.id, parseFloat(checkin.fee).toFixed(2), checkin.id, JSON.stringify(checkin));
}

function checkin_valid(checkin){
    var time = getTime();
    var timeLeft = (parseInt(checkin.posted) + parseInt(checkin.time_staying)) - time;
    return timeLeft >= 0;
}


function getNotificationPermission(){
    if (window.webkitNotifications.checkPermission() != 0) { // 0 is PERMISSION_ALLOWED
	window.webkitNotifications.requestPermission();
    }
}

function displayNotification() {
    if (window.webkitNotifications.checkPermission() != 0) { // 0 is PERMISSION_ALLOWED
	getNotificationPermission();
	setTimeout(displayNotification, 5000);
    } else {
	notification = window.webkitNotifications.createNotification(
            '', 'OrderUp', 'Your Panda Express is coming up, courtesy of Eric Rosenberg.');
	notification.show();
    }
};

function displayBadNotification() {
    if (window.webkitNotifications.checkPermission() != 0) { // 0 is PERMISSION_ALLOWED
	getNotificationPermission();
	setTimeout(displayBadNotification, 5000);
    } else {
	notification = window.webkitNotifications.createNotification(
            '', 'Your Order Request', 'Was rejected!');
	notification.show();
    }
};

window.onload = function(){
    //$("#myModal").modal({backdrop: true});
    $('.close').click(function(e){$(this).parent().fadeOut(1000);});
    update_time_staying_counters();
    setInterval(update_time_staying_counters, 1000);
    dispatch_checkins_request();
    setInterval(dispatch_checkins_request, 2000);
    //setTimeout(dispatch_checkins_request, 2000);
    MapApplet.init()
    MapApplet.placeAllMarkers(data);
}
