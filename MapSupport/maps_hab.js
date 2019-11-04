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
