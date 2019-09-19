			 

			 
        	var getJSON = function(url, callback) {
			   	var xhr = new XMLHttpRequest();
    			xhr.open('GET', url, true);
    			xhr.responseType = 'json';
                 
    			xhr.onload = function() {
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

					function getIcon() {
				var icon = {
       				url: 'http://gldw.org/docs/icons/wq_buoy.png',
        			scaledSize: new google.maps.Size(24, 24), // scaled size
        			origin: new google.maps.Point(0,0), // origin
        			anchor: new google.maps.Point(12,12) // anchor
         		};
 				return icon;
			}

			var getMarkers= function(data){
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
          			zoom: 7,
          			mapTypeId: google.maps.MapTypeId.HYBRID 
        		});
				
      			//iterate through all buoys
     			for (var obj in data.Group) {
           			buoy = data.Group[obj];
           			lat =  parseFloat(buoy.Latitude);
           			long =  parseFloat(buoy.Longitude);
					  
		            //for each buoy, have a 'div' with buoy info.
           			contentString="<div style='overflow:hidden;'>";           
           			for (var obj2 in buoy){
						if (obj2 == "EventTimestamp")
							continue;
						if (obj2 == "Label")
							continue;
						if (obj2 == "Container")
							continue;
           				contentString+="<b>"+obj2+"</b>"+": ";
            			contentString+=buoy[obj2]+"<br/>";
           			}
           			contentString+="</div>";
                     
         			marker = new google.maps.Marker({
            			position: {lat: lat, lng: long},
           				map: map,
						icon: getIcon()
					});
					
					outer = function(marker, contentString, infowindow){
						//this closure uses parameters which come from the current buoy's iteration.
						return function() {
        					infowindow.setContent(contentString);
        					infowindow.open(map, marker);
    					};
					}
					
					//"outer"'s closure becomes the callback function of the event listener.
					google.maps.event.addListener(marker,'click', outer(marker, contentString, infowindow));
					
					//make sure map centers on all buoy markers
					bounds.extend(marker.position);
        			map.fitBounds(bounds);
 				}
			}
			
			// GENERIC NEW ROUTINES
			var buildMap = function(data, buildIcon, buildContent){
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
          			zoom: 7,
          			mapTypeId: google.maps.MapTypeId.HYBRID 
        		});
				
      			//iterate through all buoys
     			for (var obj in data.Group) {
           			buoy = data.Group[obj];
           			lat =  parseFloat(buoy.Latitude);
           			long =  parseFloat(buoy.Longitude);
					  
		            //for each buoy, have a 'div' with buoy info.
           			contentString= buildContent(buoy);       
           
           			marker = new google.maps.Marker({
            			position: {lat: lat, lng: long},
           				map: map,
						icon: buildIcon(buoy)
					});
					
					outer = function(marker, contentString, infowindow){
						//this closure uses parameters which come from the current buoy's iteration.
						return function() {
        					infowindow.setContent(contentString);
        					infowindow.open(map, marker);
    					};
					}
					
					//"outer"'s closure becomes the callback function of the event listener.
					google.maps.event.addListener(marker,'click', outer(marker, contentString, infowindow));
					
					//make sure map centers on all buoy markers
					bounds.extend(marker.position);
        			map.fitBounds(bounds);
 				}
			}
			// - ICON ROUTINES - Different icon routines for different maps.
			
			function buildIcon_USGS_Percentile(buoy) {
				var icon = {
       				url: 'http://gldw.org/docs/icons/alert.png',
        			scaledSize: new google.maps.Size(33, 33), // scaled size
        			origin: new google.maps.Point(0,0), // origin
        			anchor: new google.maps.Point(12,12) // anchor
         		};
 				return icon;
			}
			// - CONTENT ROUTINES - Different content routines for different maps.
			function buildContent_USGS(buoy) {  
		            //for each buoy, have a 'div' with buoy info.
           			contentString="<div style='overflow:hidden;'>";           
           			for (var obj2 in buoy){
						if (obj2 == "EventTimestamp")
							continue;
						if (obj2 == "Label")
							continue;
						if (obj2 == "Container")
							continue;
           				contentString+="1><b>"+obj2+"</b>"+": ";
            			contentString+=buoy[obj2]+"<br/>";
           			}
           			contentString+="</div>";
					return contentString;
			}
			// - ENTRY POINTS - Different entry points for different maps.
		
			function buoyMap() {
				//retrieve json of buoy data 
				getJSON('http://ptap.gldw.org/vdab/get_BuoyData',  function(err, data) {
    				if (err != null) {
        				console.error(err);
    				} else {
   						//get and display buoy markers
    					getMarkers(data);       
  					}  
				});
			}
			function greatlakesMap() {
				//retrieve json of buoy data 
				getJSON('http://ptap.gldw.org/vdab/get_GreatLakes',  function(err, data) {
    				if (err != null) {
        				console.error(err);
    				} else {
   						//get and build the map.
    					buildMap(data, buildIcon_USGS_Percentile, buildContent_USGS);       
  					}  
				});
			}

		 