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
//	Maybe a performance issue
	google.maps.event.addListenerOnce(map, 'idle', function() { 
		var newZoom = map.getZoom()+0.5;
		if (newZoom > maxZoom)
		   newZoom = maxZoom;
		map.setZoom(newZoom);
	});

	map.fitBounds(bounds);
}
// SUPPORT ROUTINES - 
function getHTMLFormattedTitle(label) {
	contentString = "<b> <center>" + label + "</b> </center>";
	return contentString;
}
function getHTMLFormattedMetric(label, value) {
	contentString = "<b>" + label + "</b>" + ": " + value + "<br/>";
	return contentString;
}
function getHTMLFormattedAttribute(label, value) {
	contentString = "<b>" + label + "</b>" + ": " + value + "<br/>";
	return contentString;
}
function getHTMLFormattedEventTime(label, value) {
	contentString = "<center>" + label + "</center> <br/>";
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
function getHTMLFormattedAlertingMeasurement(buoy, label, value, shouldAlert) {
	contentString = "";
	if (shouldAlert) {
		contentString += "<span style='background-color: yellow' >  <b>";
		contentString += getHTMLFormattedMeasurement(buoy, label, value);
		contentString += "</b> </span>";
	}
	else {	
		contentString += "<b>";
		contentString += getHTMLFormattedMeasurement(buoy, label, value);
		contentString += "</b>";	
	}

	return contentString;
} 
function getHTMLFormattedMeasurement(buoy, label, value) {
	var dotIndex = value.indexOf(".");
	var endPos = 4;
	if (dotIndex > endPos){
		endPos = dotIndex -1;
	}
	if (dotIndex > 0){
		value = value.substring(0, endPos);
	}
	var unit = buoy["UNIT_"+label];

	contentString = "<b>" + label + "</b>" + ": " + value ;
	if (unit != null ){ 
		contentString += " "+ unit;
	}
	contentString += "<br/>";
	return contentString;
}
// - DEFAULT - default icon and content routines
function buildIcon_default(data) {
	var icon = {
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
