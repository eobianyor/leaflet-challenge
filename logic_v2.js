// // Creating map function


// // Adding tile layer
// var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "streets-v11",
//   accessToken: API_KEY
// });

// // // Create overlay object to hold the earthquake data
// // var overlayMaps = {
// //   "Earthquakes": earthquakes
// // }

// // Creating map object
// var myMap = L.map("map", {
//   center: [20.05, -20.05],
//   zoom: 2,
//   //layers: [streetmap, earthquakes]
// });
// // streetmap.addTo(myMap);


var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

// -------------------------------------------------------------------------------------------------------------------
// RUN GET TO GRAB DATA FROM THE GEOJSON LINK
// -------------------------------------------------------------------------------------------------------------------
// Define arrays to hold created earthquake markers and plate boundary polyline
var eqMarkers = [];
var polyLineBoundary = [];

// // Perform a GET request to the query URL
d3.json("static/data/PB2002_boundaries.json", function (data) {
  console.log()
  // d3.json(link, function (data) {
  // Once we get a response, create a geoJSON layer containing the features array and add a popup for each marker
  // then, send the layer to the createMap() function.
  var plateBoundary = L.geoJSON(data.features, {
    drawPlateLines
  });

  createMap(plateBoundary);
});
// -------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR creating THE EARTHQUAKE CIRCLES
// -------------------------------------------------------------------------------------------------------------------
function drawPlateLines(feature, layer) {
  // Coordinates for each point to be used in the polyline
  var plateLines = [features.geometry.coordinates[1], features.geometry.coordinates[0]];
  console.log(plateLines)
  // Setting the marker radius for the city by passing population into the markerSize function

  polyLineBoundary.push(
    L.polyline(plateLines, {
      stroke: true,
      fillOpacity: 0.99,
      color: "red",
      fillColor: "blue",
    }).addTo(myMap),
  );
}

// // -------------------------------------------------------------------------------------------------------------------
// // FUNCTION FOR PLATE BOUNDARIES
// // -------------------------------------------------------------------------------------------------------------------
// // function makePolyLine(feature, layer) {
// // d3.json("static/data/PB2002_boundaries.json").then((plateData) => {
// d3.json("static/data/PB2002_boundaries.json", function (plateData) {
//   plateData.forEach(function (boundary) {
//     // Coordinates for each point to be used in the polyline
//     var plateLines = [boundary.features.geometry.coordinates[1], boundary.features.geometry.coordinates[0]];

//     // Create a polyline using the line coordinates and pass in some initial options
//     L.polyline(plateLines, {
//       color: "red"
//     }).addTo(myMap);

//   })
// })

// -------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR CREATING THE MAP
// -------------------------------------------------------------------------------------------------------------------
function createMap(plateBoundary) {
  // Define variables for our base layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 10,
    id: "streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 10,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Create two separate layer groups: one for earthquakes and one for ???
  // var earthquakes = L.layerGroup(eqMarkers);
  var plateBoundary = L.layerGroup(polyLineBoundary);

  // Create a baseMaps object
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create an overlay object
  var overlayMaps = {
    // "earthquake Overlay": earthquakes,
    "plateBoundary Overlay": plateBoundary,
  };

  // Define a map object
  var myMap = L.map("map", {
    center: [35.00, 0.00],
    zoom: 3,
    layers: [streetmap, plateBoundary]
  });

  // Pass our map layers into our layer control
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}



// -------------------------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------------------------