function buildIcon_NDBC(buoy) {
	var icon;
	if (buoy.WaveHeight == null) {
		var icon = {
			url: '/vdab/_f?dir=web/icons&name=wq_station&type=png',
			scaledSize: new google.maps.Size(27, 27), // scaled size
			origin: new google.maps.Point(0, 0), // origin
			anchor: new google.maps.Point(13, 13) // anchor
		};
	}
	else {
		var icon = {
			url: '/vdab/_f?dir=web/icons&name=wq_buoy&type=png',
			scaledSize: new google.maps.Size(27, 27), // scaled size
			origin: new google.maps.Point(0, 0), // origin
			anchor: new google.maps.Point(13, 13) // anchor
		};
	}
	return icon;
}

function buildContent_NDBC(buoy) {
	//for each buoy, have a 'div' with buoy info.
	contentString = "<div style='overflow:hidden;'>";
	for (var obj2 in buoy) {
		if (obj2.startsWith("UNIT_")) {
			continue;
		}
		switch (obj2) {
			case "EventTimestamp":
			case "Label":
			case "Container":
				break;
				
			case "BuoyInfo":
				contentString += getHTMLFormattedTitle(buoy[obj2]);
				break;

			case "Path":
				contentString += getHTMLFormattedAttribute(obj2, buoy[obj2]);
				break;
	
			case "EventTime":
				contentString += getHTMLFormattedEventTime(buoy[obj2]);
				break;

			case "GustSpeed":
				contentString += getHTMLFormattedAlertingMeasurement(buoy, obj2, buoy[obj2], (buoy[obj2] > 20));
				break;

			case "WindSpeed":
				contentString += getHTMLFormattedAlertingMeasurement(buoy, obj2, buoy[obj2], (buoy[obj2] > 15));
				break;

			case "Link":
				break;
				
			case "Latitude":
			case "Longitude":
				contentString += getHTMLFormattedAttribute(obj2, buoy[obj2]);
				break;
			
			default:
				contentString += getHTMLFormattedMeasurement(buoy, obj2, buoy[obj2]);
				break;
		}

	}
	for (var obj2 in buoy) {
		switch (obj2) {

			case "Link":
				var url = buoy[obj2];
				contentString += "<br/> <b> <center> <a href=" + url + " >"
				contentString += "<img src='https://gldw.org/docs/icons/ndbc.png' alt='Link to NDBC' width='75' height='35' >";
				contentString += "</a> </center> </b>"
				break;

			default:
				break;
		}
	}
	contentString += "</div>";
	return contentString;
}