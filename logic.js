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
var plateLines = [];

// // Perform a GET request to the query URL
d3.json(link, function (data) {
  // Once we get a response, create a geoJSON layer containing the features array and add a popup for each marker
  // then, send the layer to the createMap() function.
  var earthquakes = L.geoJSON(data.features, {
    onEachFeature: makeCircles
  });

  d3.json("static/data/PB2002_boundaries.json", function (plateData) {
    // Once we get a response, create a geoJSON layer containing the features array and add a popup for each marker
    // then, send the layer to the createMap() function.
    // var plateLines = [features.geometry.coordinates[1], features.geometry.coordinates[0]];
    // console.log(plateLines)
    var plateBoundaryLines = L.geoJSON(data.features, {
      onEachFeature: makePolyLine
    });
  });
  createMap(earthquakes);
});
// -------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR creating THE EARTHQUAKE CIRCLES
// -------------------------------------------------------------------------------------------------------------------
function makeCircles(feature, layer) {

  // Loop through the earthquake incdents to select approriate color for each based on the depth.

  var eqcolor = "";

  if (feature.geometry.coordinates[2] > 250) {
    eqcolor = "#4A235A";
  }
  else if (feature.geometry.coordinates[2] > 150) {
    eqcolor = "#6C3483";
  }
  else if (feature.geometry.coordinates[2] > 50) {
    eqcolor = "#8E44AD";
  }
  else {
    eqcolor = "#A569BD";
  }

  // Setting the marker radius for the city by passing population into the markerSize function

  eqMarkers.push(
    L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
      stroke: false,
      fillOpacity: 0.75,
      color: "black",
      fillColor: eqcolor,
      radius: ((feature.properties.mag) * 50000),
    }),
  );
}

// -------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR PLATE BOUNDARIES
// -------------------------------------------------------------------------------------------------------------------

// d3.json("static/data/PB2002_boundaries.json").then((plateData) => {
// d3.json("static/data/PB2002_boundaries.json", function (plateData) {
// plateData.forEach(function (boundary) {
function makePolyLine(feature, layer) {
  // Coordinates for each point to be used in the polyline
  var platePointList = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
  var polyline = [];
  console.log(platePointList);
  // console.log(plateLines);
  // Create a polyline using the line coordinates and pass in some initial options
  plateLines.push(
    polyline = new L.polyline(platePointList, {
      color: 'red',
      weight: 5000,
      opacity: 0.5,
      smoothFactor: 1
    }),
    // polyline.addTo(map),
  );

}

// -------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR CREATING THE MAP
// -------------------------------------------------------------------------------------------------------------------
function createMap(earthquakes) {
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
  var earthquakes = L.layerGroup(eqMarkers);
  var plateBoundary = L.layerGroup(plateLines);

  // Create a baseMaps object
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create an overlay object
  var overlayMaps = {
    "earthquake Overlay": earthquakes,
    "plateBoundary Overlay": plateBoundary,
  };

  // Define a map object
  var myMap = L.map("map", {
    center: [35.00, 0.00],
    zoom: 3,
    layers: [streetmap, earthquakes, plateBoundary]
  });

  // Pass our map layers into our layer control
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
