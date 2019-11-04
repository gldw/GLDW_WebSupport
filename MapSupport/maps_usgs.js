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
	return n;
}
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

	// Get first part of name by checking the HUSub.
	var namePart1;
	var namePart2;

	if (HUSub == uniquecodes[0]) {
		namePart1 = "huA";
	}
	else if (HUSub == uniquecodes[1]) {
		namePart1 = "huB";
	}
	else if (HUSub == uniquecodes[2]) {
		namePart1 = "huC";
	}
	else if (HUSub == uniquecodes[3]) {
		namePart1 = "huD";
	}

	// Get second part of name by checking the percent

	if (buoy.Percentile >= VERYHIGH) {
		namePart2 = "veryhighpcnt";
	}
	else if (buoy.Percentile >= HIGH) {
		namePart2 = "highpcnt";
	}
	else if (buoy.Percentile >= MEDIUMHIGH) {
		namePart2 = "mediumhighpcnt";
	}
	else if (buoy.Percentile >= MEDIUM) {
		namePart2 = "mediumpcnt";
	}
	else if (buoy.Percentile >= LOW) {
		namePart2 = "lowpcnt";
	}

	var name = namePart1 + '_' + namePart2;
	icon = {
		url: '/vdab/_f?dir=web/icons&name=' + name + '&type=png',
		scaledSize: new google.maps.Size(20, 20), // scaled size
		origin: new google.maps.Point(0, 0), // origin
		anchor: new google.maps.Point(10, 10) // anchor
	}
	return icon;
}
