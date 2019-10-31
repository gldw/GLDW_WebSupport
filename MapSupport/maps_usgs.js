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

if (HUSub == uniquecodes[0]){
namePart1 = "huA";
    }
else if (HUSub == uniquecodes[1]){
namePart1 = "huB";  
}
else if (HUSub == uniquecodes[2]){
namePart1 = "huC";  
}
else if (HUSub == uniquecodes[3]){
namePart1 = "huD";
}

// Get second part of name by checking the percent

if (buoy.Percentile >= VERYHIGH){
namePart2 = "veryhighpcnt"; 
}
else if (buoy.Percentile >= HIGH){
namePart2 = "highpcnt"; 
}
else if (buoy.Percentile >= MEDIUMHIGH){
namePart2 = "mediumhighpcnt"; 
}
else if (buoy.Percentile >= MEDIUM){
namePart2 = "mediumpcnt"; 
}
else if (buoy.Percentile >= LOW){
namePart2 = "lowpcnt"; 
}

var name = namePart1+'_'+namePart2;
icon = {
url: '/vdab/_f?dir=web/icons&name='+name+'&type=png',
scaledSize: new google.maps.Size(20, 20), // scaled size
    origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(10,10) // anchor
}
return icon;
}
