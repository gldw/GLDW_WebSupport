			 


var getJSON = function (url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'json';

	xhr.onload = function () {
		var status = xhr.status;

		if (status == 200) {
			//request succeeded, evoking callback with json data
			callback(null, xhr.response);
		} else {
			callback(status);
		}
	};

	xhr.send();
};

// GENERIC ROUTINES
var buildMap = function (data, buildIcon, buildContent) {
	var bounds = new google.maps.LatLngBounds();
	var lat;
	var long;
	var buoy;
	var map;
	var contentString;
	var marker;
	var outer;
	var infowindow = new google.maps.InfoWindow();

	//initialize map, set center and zoom
	map = new google.maps.Map(document.getElementById('googleMap'), {
		mapTypeId: google.maps.MapTypeId.HYBRID
	});

	//iterate through all buoys
	for (var obj in data.Group) {
		buoy = data.Group[obj];
		lat = parseFloat(buoy.Latitude);
		long = parseFloat(buoy.Longitude);

		//for each buoy, have a 'div' with buoy info.
		contentString = buildContent(buoy);

		marker = new google.maps.Marker({
			position: { lat: lat, lng: long },
			map: map,
			icon: buildIcon(buoy)
		});

		outer = function (marker, contentString, infowindow) {
			//this closure uses parameters which come from the current buoy's iteration.
			return function () {
				infowindow.setContent(contentString);
				infowindow.open(map, marker);
			};
		}

		//"outer"'s closure becomes the callback function of the event listener.
		google.maps.event.addListener(marker, 'click', outer(marker, contentString, infowindow));

		//make sure map centers on all buoy markers
		bounds.extend(marker.position);	
	}
	google.maps.event.addListenerOnce(map, 'idle', function() { map.setZoom(map.getZoom()+1);});
	map.fitBounds(bounds);
}
// - ICON ROUTINES - Different icon routines for different maps.

function buildIcon_USGS_Percentile(buoy) {
	var icon;
	if (buoy.Percentile > 97) {
		icon = {
			url: 'http://gldw.org/docs/icons/alert.png',
			scaledSize: new google.maps.Size(33, 33), // scaled size
    		origin: new google.maps.Point(0,0), // origin
        	anchor: new google.maps.Point(6,33) // anchor
		}
	}
	else if (buoy.Percentile > 92)  {
		icon = {
			url: 'http://gldw.org/docs/icons/emblem-important-4.png',
			scaledSize: new google.maps.Size(20, 20), // scaled size
			origin: new google.maps.Point(0, 0), // origin
			anchor: new google.maps.Point(10,10) // anchor
		}
	}
	else if (buoy.Percentile > 85)  {
		icon = {
			url: 'http://gldw.org/docs/icons/emblem-important-2.png',
			scaledSize: new google.maps.Size(20, 20), // scaled size
			origin: new google.maps.Point(0, 0), // origin
			anchor: new google.maps.Point(10,10) // anchor
		}
	}
	else {
		icon = {
			url: 'http://gldw.org/docs/icons/circle_grey.png',
			scaledSize: new google.maps.Size(10, 10), // scaled size
			origin: new google.maps.Point(0, 0), // origin
			anchor: new google.maps.Point(5,5) // anchor
		}
	}
return icon;
}
function buildIcon_NDBC(buoy) {
	var icon = {
		url: 'http://gldw.org/docs/icons/wq_buoy.png',
		scaledSize: new google.maps.Size(24, 24), // scaled size
		origin: new google.maps.Point(0, 0), // origin
		anchor: new google.maps.Point(12, 12) // anchor
	};
	return icon;
}
// - CONTENT ROUTINES - Different content routines for different maps.
function buildContent_USGS(station) {
	//for each buoy, have a 'div' with buoy info.
	contentString = "<div style='overflow:hidden;'>";
	for (var obj2 in station) {
		if (obj2 == "EventTimestamp")
			continue;
		if (obj2 == "Label")
			continue;
		if (obj2 == "Container")
			continue;
		if (obj2 == "Link") {
			var url = station[obj2];
			contentString += "<b> <center> <a href=" + url + " >"
			contentString += "<img src='http://gldw.org/docs/icons/usgs.png' alt='Link to USGS' width='60' height='30' >";
			contentString += "</a> </center> </b>"
		}
		else if (obj2 == "Title") {
			contentString += "<b> <center>" + station[obj2] + "</b> </center> <br/>";			
		}
		else {
			contentString += "<b>" + obj2 + "</b>" + ": " + station[obj2] + "<br/>";
		}
	}
	contentString += "</div>";
	return contentString;
}
function buildContent_NDBC(buoy) {
	//for each buoy, have a 'div' with buoy info.
	contentString = "<div style='overflow:hidden;'>";
	for (var obj2 in buoy) {
		if (obj2 == "EventTimestamp")
			continue;
		if (obj2 == "Label")
			continue;
		if (obj2 == "Container")
			continue;		
		
		if (obj2 == "BuoyInfo") {
			contentString += "<center> <b>" + buoy[obj2] + "</b> </center> <br/>";			
		}
		else {
			contentString += "<b>" + obj2 + "</b>" + ": " + buoy[obj2] + "<br/>";
		}
	}
	contentString += "</div>";
	return contentString;
}
// - ENTRY POINTS - Different entry points for different maps.

function buoyMap() {
	//retrieve json of buoy data 
	getJSON('http://ptap.gldw.org/vdab/get_BuoyData', function (err, data) {
		if (err != null) {
			console.error(err);
		} else {
			//get and build the map.
			buildMap(data, buildIcon_NDBC, buildContent_NDBC);
		}
	});
}
function greatlakesMap() {
	//retrieve json of buoy data 
	getJSON('http://ptap.gldw.org/vdab/get_GreatLakes', function (err, data) {
		if (err != null) {
			console.error(err);
		} else {
			//get and build the map.
			buildMap(data, buildIcon_USGS_Percentile, buildContent_USGS);

		}
	});
}

		 