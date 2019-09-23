// ALL MAPS not supported with IE
function isBrowserSupported() {
	if (navigator.userAgent.search("Chrome") >= 0) {
		return "";
	}
	if (navigator.userAgent.search("Safari") >= 0) {
		return "";
	}
	if (navigator.userAgent.search("Firefox") >= 0) {
		return "";
	}
	if (navigator.userAgent.search("Opera") >= 0) {
		return "";
	}
	if (navigator.userAgent.search("Edge") >= 0) {
		return "";
	}
	return "<h3> Internet Explorer is not supported </h3> If the content is not shown properly switch to any other browser";
}

function getJSON(url, callback) {
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
}
// GENERIC ROUTINES
function buildMap(data, buildIcon, buildContent, maxZoom) {
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
	google.maps.event.addListenerOnce(map, 'idle', function() { 
		var newZoom = map.getZoom()+0.8;
		if (newZoom > maxZoom)
		   newZoom = maxZoom;
		map.setZoom(newZoom);
	});
	map.fitBounds(bounds);
}
// SUPPORT ROUTINES - 
function getHTMLFormattedMetric(label, value) {
	contentString = "<b>" + label + "</b>" + ": " + value + "<br/>";
	return contentString;
}
function getHTMLFormattedTitle(label) {
	contentString = "<b> <center>" + label + "</b> </center>";
	return contentString;
}
function getHTMLFormattedAlertingMetric(label, value, shouldAlert) {
	contentString = "";
	if (shouldAlert) {
	
		contentString += "<b>" + label + ": " 
		contentString += "<span style='background-color: yellow' > ";
		contentString += ""+ value + " </b>";
		contentString += "</span> <br/>";
	}
	else {
		contentString += "<b>" + label + "</b>" + ": " + value + "<br/>";
	}

	return contentString;
}

// - ICON ROUTINES - Different icon routines for different maps.
function buildIcon_default(data) {
	var icon = {
		url: 'http://gldw.org/docs/icons/wq_buoy.png',
		scaledSize: new google.maps.Size(24, 24), // scaled size
		origin: new google.maps.Point(0, 0), // origin
		anchor: new google.maps.Point(12, 12) // anchor
	};
	return icon;
}
function buildContent_default(data) {
	//for each buoy, have a 'div' with buoy info.
	contentString = "<div style='overflow:hidden;'>";
	for (var obj2 in data) {
		if (obj2 == "EventTimestamp")
			continue;
		if (obj2 == "Label")
			continue;
		if (obj2 == "Container")
			continue;		
		contentString += "<b>" + obj2 + "</b>" + ": " + data[obj2] + "<br/>";
		}

	contentString += "</div>";
	return contentString;
}
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
	else if (buoy.Percentile > 90)  {
		icon = {
			url: 'http://gldw.org/docs/icons/emblem-important-4.png',
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
			contentString += "<br/> <b> <center> <a href=" + url + " >"
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
			switch (obj2){
				case "GustSpeed":
					contentString += getHTMLFormattedAlertingMetric(obj2, buoy[obj2], (buoy[obj2] > 10));
					break;

				case "WindSpeed":
					contentString += getHTMLFormattedAlertingMetric(obj2, buoy[obj2], (buoy[obj2] > 9));
					break;

				default:
					contentString += getHTMLFormattedMetric(obj2, buoy[obj2]);
					break;
			}
		
		}
	}
	contentString += "<br/> <b> <center> <a href='https://www.ndbc.noaa.gov' >"
			contentString += "<img src='http://gldw.org/docs/icons/ndbc.png' alt='Link to NDBC' width='75' height='35' >";
			contentString += "</a> </center> </b>"
	contentString += "</div>";
	return contentString;
}
function buildContent_ErieHAB(station) {
	//for each buoy, have a 'div' with buoy info.
	contentString = "<div style='overflow:hidden;'>";
	for (var obj2 in station) {
		if (obj2 == "EventTimestamp")
			continue;
		if (obj2 == "Label")
			continue;
		if (obj2 == "Container")
			continue;
		else if (obj2 == "Path") {
			contentString += getHTMLFormattedTitle(station[obj2]);			
		}
		else if (obj2 == "EventTime") {
			contentString += "<center>" + station[obj2] + "</center> <br/>";			
		}
		else {
			switch (obj2){
				case "BGA (ug/L)":
					contentString += getHTMLFormattedAlertingMetric(obj2, station[obj2], (station[obj2] > 5));
					break;
				case "Chlorophyll (ug/L)":
					contentString += getHTMLFormattedAlertingMetric(obj2, station[obj2], (station[obj2] > 10));
					break;
				case "BGA/Chlorophyll":
					contentString += getHTMLFormattedAlertingMetric(obj2, station[obj2],(station[obj2] > 0.5));
					contentString += "<br/>";
					break;
				default:
					contentString += getHTMLFormattedMetric(obj2, station[obj2]);
					break;
			}
			

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
			alert("FAILED"+err);
			console.error(err);
		} else {
			//get and build the map.
			buildMap(data, buildIcon_NDBC, buildContent_NDBC, 8);
		}
	});
}
function greatlakesMap() {
	//retrieve json of buoy data 
	getJSON('http://ptap.gldw.org/vdab/get_GreatLakes', function (err, data) {
		if (err != null) {
			alert("FAILED "+err);
			console.error(err);
		} else {
			//get and build the map.
			buildMap(data, buildIcon_USGS_Percentile, buildContent_USGS, 7);

		}
	});
}
function erieHABMap() {
	//retrieve json of buoy data 
	getJSON('http://ptap.gldw.org/vdab/get_ErieHAB', function (err, data) {
		if (err != null) {
			alert("FAILED "+err);
			console.error(err);
		} else {
			//get and build the map.
			buildMap(data, buildIcon_default, buildContent_ErieHAB, 9);

		}
	});
}

		 