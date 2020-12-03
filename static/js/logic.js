// Adding tile layer
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "streets-v11",
    accessToken: API_KEY
});

// // Create overlay object to hold the earthquake data
// var overlayMaps = {
//   "Earthquakes": earthquakes
// }

// Creating map object
var myMap = L.map("mapid", {
    center: [20.05, -20.05],
    zoom: 3,
    //layers: [streetmap, earthquakes]
});
streetmap.addTo(myMap);


// var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// // Add a marker to the map for each earthquake
// d3.json(link).then(function (response) {
//     console.log(response);
// })

