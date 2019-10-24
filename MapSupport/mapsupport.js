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
		url: 'https://gldw.org/docs/icons/wq_buoy.png',
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
			url: 'https://gldw.org/docs/icons/alert.png',
			scaledSize: new google.maps.Size(33, 33), // scaled size
    		origin: new google.maps.Point(0,0), // origin
        	anchor: new google.maps.Point(6,33) // anchor
		}
	}
	else if (buoy.Percentile > 90)  {
		icon = {
			url: 'https://gldw.org/docs/icons/emblem-important-4.png',
			scaledSize: new google.maps.Size(20, 20), // scaled size
			origin: new google.maps.Point(0, 0), // origin
			anchor: new google.maps.Point(10,10) // anchor
		}
	}
	else {
		icon = {
			url: 'https://gldw.org/docs/icons/circle_grey.png',
			scaledSize: new google.maps.Size(10, 10), // scaled size
			origin: new google.maps.Point(0, 0), // origin
			anchor: new google.maps.Point(5,5) // anchor
		}
	}
	return icon;
}
function buildIcon_NDBC(buoy) {
	var icon;
	if (buoy.WaveHeight == null) {
		var icon = {
			url: 'https://gldw.org/docs/icons/wq_station.png',
			scaledSize: new google.maps.Size(27, 27), // scaled size
			origin: new google.maps.Point(0, 0), // origin
			anchor: new google.maps.Point(13, 13) // anchor
		};
	}
	else {
		var icon = {
			url: 'https://gldw.org/docs/icons/wq_buoy.png',
			scaledSize: new google.maps.Size(27, 27), // scaled size
			origin: new google.maps.Point(0, 0), // origin
			anchor: new google.maps.Point(13, 13) // anchor
		};
	}
	return icon;
}
// - CONTENT ROUTINES - Different content routines for different maps.
function buildContent_USGS(station) {
	//for each buoy, have a 'div' with buoy info.
	contentString = "<div style='overflow:hidden;'>";
	for (var obj2 in station) {
			switch (obj2) {
			case "EventTimestamp":
			case "Label":
			case "Container":
				break;

			case "Link":
				var url = station[obj2];
				contentString += "<br/> <b> <center> <a href=" + url + " >"
				contentString += "<img src='https://gldw.org/docs/icons/usgs.png' alt='Link to USGS' width='60' height='30' >";
				contentString += "</a> </center> </b>"
				break;

			case "Title":
				contentString += getHTMLFormattedTitle(station[obj2]);
				break;

			case "Sample Time":
				contentString += "<center>" + station[obj2] + "</center> <br/>";
				break;

			case "Percentile":
				contentString += getHTMLFormattedAlertingMetric(obj2, station[obj2], (station[obj2] > 90));
				break;

			default:
				contentString += "<b>" + obj2 + "</b>" + ": " + station[obj2] + "<br/>";
				break;
		}
	}

	contentString += "</div>";
	return contentString;
}
function buildContent_NDBC(buoy) {
	//for each buoy, have a 'div' with buoy info.
	contentString = "<div style='overflow:hidden;'>";
	for (var obj2 in buoy) {
		switch (obj2) {
			case "EventTimestamp":
			case "Label":
			case "Container":
				break;

			case "BuoyInfo":
				contentString += getHTMLFormattedTitle(buoy[obj2]);
				break;

			case "EventTime":
				contentString += "<center>" + buoy[obj2] + "</center> <br/>";
				break;

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

	contentString += "<br/> <b> <center> <a href='https://www.ndbc.noaa.gov' >"
	contentString += "<img src='https://gldw.org/docs/icons/ndbc.png' alt='Link to NDBC' width='75' height='35' >";
	contentString += "</a> </center> </b>"
	contentString += "</div>";
	return contentString;
}

function buildContent_ErieHAB(station) {
	//for each buoy, have a 'div' with buoy info.
	contentString = "<div style='overflow:hidden;'>";
	for (var obj2 in station) {

		switch (obj2) {
			case "EventTimestamp":
			case "Label":
			case "Container":
				break;

			case "Path":
				contentString += getHTMLFormattedTitle(station[obj2]);
				break;

			case "EventTime":
				contentString += "<center>" + station[obj2] + "</center> <br/>";
				break;

			case "BGA (ug/L)":
				contentString += getHTMLFormattedAlertingMetric(obj2, station[obj2], (station[obj2] > 5));
				break;

			case "Chlorophyll (ug/L)":
				contentString += getHTMLFormattedAlertingMetric(obj2, station[obj2], (station[obj2] > 10));
				break;

			case "BGA/Chlorophyll":
				contentString += getHTMLFormattedAlertingMetric(obj2, station[obj2], (station[obj2] > 0.5));
				contentString += "<br/>";
				break;

			default:
				contentString += getHTMLFormattedMetric(obj2, station[obj2]);
				break;
		}


	}
	contentString += "</div>";
	return contentString;
}
// - ENTRY POINTS - Different entry points for different maps.

// ======================================================
var uniquecodes=[];

function getCodes(data){
	var buoy;
	var codes=[];
	var code;

	var n = 0;
	for (var obj in data.Group){
		buoy = data.Group[obj];
		n++;
		code = buoy.HUCode.substring(0, 2);
		codes.push(code);
	}
	
	//filter all HUCodes of State to unique values.
	function onlyUnique(value, index, self) { 
    	return self.indexOf(value) === index;
	}
	uniquecodes = codes.filter( onlyUnique );
//	DEPRECATE - MJA - 23 OCT 19	
//	uniquecodes.map((num) => parseFloat(num));
//	uniquecodes.sort(function(a, b){return a-b});
	return n;
}
function buildIcon_USGS(buoy) {
	var icon;
	var HUSub;

	const VERYHIGH = 97.0,
		HIGH = 92.0,
		MEDIUMHIGH = 90.0,
		MEDIUM = 50,
		LOW = 0;


	code = buoy.HUCode.substring(0, 2);
	HUSub = parseFloat(code);

	if (HUSub == uniquecodes[0]) {
		if (buoy.Percentile >= VERYHIGH) {
			icon = {
				url: 'https://gldw.org/docs/icons/huA_veryhighpcnt.png',
				scaledSize: new google.maps.Size(20, 20), // scaled size
				origin: new google.maps.Point(0, 0), // origin
				anchor: new google.maps.Point(10, 10) // anchor
			}
		}
		else if (buoy.Percentile >= HIGH) {
			icon = {
				url: 'https://gldw.org/docs/icons/huA_highpcnt.png',
				scaledSize: new google.maps.Size(20, 20), // scaled size
				origin: new google.maps.Point(0, 0), // origin
				anchor: new google.maps.Point(10, 10) // anchor
			}
		}
		else if (buoy.Percentile >= MEDIUMHIGH) {
			icon = {
				url: 'https://gldw.org/docs/icons/huA_mediumhighpcnt.png',
				scaledSize: new google.maps.Size(20, 20), // scaled size
				origin: new google.maps.Point(0, 0), // origin
				anchor: new google.maps.Point(10, 10) // anchor
			}
		}
		else if (buoy.Percentile >= MEDIUM) {
			icon = {
				url: 'https://gldw.org/docs/icons/huA_mediumpcnt.png',
				scaledSize: new google.maps.Size(20, 20), // scaled size
				origin: new google.maps.Point(0, 0), // origin
				anchor: new google.maps.Point(10, 10) // anchor
			}
		}
		else {
			icon = {
				url: 'https://gldw.org/docs/icons/huA_lowpcnt.png',
				scaledSize: new google.maps.Size(20, 20), // scaled size
				origin: new google.maps.Point(0, 0), // origin
				anchor: new google.maps.Point(10, 10) // anchor
			}
		}

	}
	if (HUSub == uniquecodes[1]) {
		if (buoy.Percentile >= VERYHIGH) {
			icon = {
				url: 'https://gldw.org/docs/icons/huB_veryhighpcnt.png',
				scaledSize: new google.maps.Size(20, 20), // scaled size
				origin: new google.maps.Point(0, 0), // origin
				anchor: new google.maps.Point(10, 10) // anchor
			}
		}
		else if (buoy.Percentile >= HIGH) {
			icon = {
				url: 'https://gldw.org/docs/icons/huB_highpcnt.png',
				scaledSize: new google.maps.Size(20, 20), // scaled size
				origin: new google.maps.Point(0, 0), // origin
				anchor: new google.maps.Point(10, 10) // anchor
			}
		}
		else if (buoy.Percentile >= MEDIUMHIGH) {
			icon = {
				url: 'https://gldw.org/docs/icons/huB_mediumhighpcnt.png',
				scaledSize: new google.maps.Size(20, 20), // scaled size
				origin: new google.maps.Point(0, 0), // origin
				anchor: new google.maps.Point(10, 10) // anchor
			}
		}
		else if (buoy.Percentile >= MEDIUM) {
			icon = {
				url: 'https://gldw.org/docs/icons/huB_mediumpcnt.png',
				scaledSize: new google.maps.Size(20, 20), // scaled size
				origin: new google.maps.Point(0, 0), // origin
				anchor: new google.maps.Point(10, 10) // anchor
			}
		}
		else {
			icon = {
				url: 'https://gldw.org/docs/icons/huB_lowpcnt.png',
				scaledSize: new google.maps.Size(20, 20), // scaled size
				origin: new google.maps.Point(0, 0), // origin
				anchor: new google.maps.Point(10, 10) // anchor
			}
		}

	}
	if (HUSub == uniquecodes[2]) {
		if (buoy.Percentile >= VERYHIGH) {
			icon = {
				url: 'https://gldw.org/docs/icons/huC_veryhighpcnt.png',
				scaledSize: new google.maps.Size(20, 20), // scaled size
				origin: new google.maps.Point(0, 0), // origin
				anchor: new google.maps.Point(10, 10) // anchor
			}
		}
		else if (buoy.Percentile >= HIGH) {
			icon = {
				url: 'https://gldw.org/docs/icons/huC_highpcnt.png',
				scaledSize: new google.maps.Size(20, 20), // scaled size
				origin: new google.maps.Point(0, 0), // origin
				anchor: new google.maps.Point(10, 10) // anchor
			}
		}
		else if (buoy.Percentile >= MEDIUMHIGH) {
			icon = {
				url: 'https://gldw.org/docs/icons/huC_mediumhighpcnt.png',
				scaledSize: new google.maps.Size(20, 20), // scaled size
				origin: new google.maps.Point(0, 0), // origin
				anchor: new google.maps.Point(10, 10) // anchor
			}
		}
		else if (buoy.Percentile >= MEDIUM) {
			icon = {
				url: 'https://gldw.org/docs/icons/huC_mediumpcnt.png',
				scaledSize: new google.maps.Size(20, 20), // scaled size
				origin: new google.maps.Point(0, 0), // origin
				anchor: new google.maps.Point(10, 10) // anchor
			}
		}
		else {
			icon = {
				url: 'https://gldw.org/docs/icons/huC_lowpcnt.png',
				scaledSize: new google.maps.Size(20, 20), // scaled size
				origin: new google.maps.Point(0, 0), // origin
				anchor: new google.maps.Point(10, 10) // anchor
			}
		}

	}
	if (HUSub == uniquecodes[3]) {
		if (buoy.Percentile >= VERYHIGH) {
			icon = {
				url: 'https://gldw.org/docs/icons/huD_veryhighpcnt.png',
				scaledSize: new google.maps.Size(20, 20), // scaled size
				origin: new google.maps.Point(0, 0), // origin
				anchor: new google.maps.Point(10, 10) // anchor
			}
		}
		else if (buoy.Percentile >= HIGH) {
			icon = {
				url: 'https://gldw.org/docs/icons/huD_highpcnt.png',
				scaledSize: new google.maps.Size(20, 20), // scaled size
				origin: new google.maps.Point(0, 0), // origin
				anchor: new google.maps.Point(10, 10) // anchor
			}
		}
		else if (buoy.Percentile >= MEDIUMHIGH) {
			icon = {
				url: 'https://gldw.org/docs/icons/huD_mediumhighpcnt.png',
				scaledSize: new google.maps.Size(20, 20), // scaled size
				origin: new google.maps.Point(0, 0), // origin
				anchor: new google.maps.Point(10, 10) // anchor
			}
		}
		else if (buoy.Percentile >= MEDIUM) {
			icon = {
				url: 'https://gldw.org/docs/icons/huD_mediumpcnt.png',
				scaledSize: new google.maps.Size(20, 20), // scaled size
				origin: new google.maps.Point(0, 0), // origin
				anchor: new google.maps.Point(10, 10) // anchor
			}
		}
		else {
			icon = {
				url: 'https://gldw.org/docs/icons/huD_lowpcnt.png',
				scaledSize: new google.maps.Size(20, 20), // scaled size
				origin: new google.maps.Point(0, 0), // origin
				anchor: new google.maps.Point(10, 10) // anchor
			}
		}

	}

return icon;
}

