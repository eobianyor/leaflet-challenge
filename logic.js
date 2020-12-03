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

// -------------------------------------------------------------------------------------------------------------------
// Define arrays to hold created city and state markers
var eqMarkers = [];

// // Perform a GET request to the query URL
d3.json(link, function (data) {
  // Once we get a response, create a geoJSON layer containing the features array and add a popup for each marker
  // then, send the layer to the createMap() function.
  var earthquakes = L.geoJSON(data.features, {
    onEachFeature: makeCircles
  });

  createMap(earthquakes);
});

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
      color: "purple",
      fillColor: eqcolor,
      radius: ((feature.properties.mag) * 100000),
    }),
  );
}


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

  // Create a baseMaps object
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create an overlay object
  var overlayMaps = {
    "earthquake Overlay": earthquakes,
  };

  // Define a map object
  var myMap = L.map("map", {
    center: [35.00, -35.00],
    zoom: 2,
    layers: [streetmap, earthquakes]
  });

  // Pass our map layers into our layer control
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

// -------------------------------------------------------------------------------------------------------------------
// [feature.geometry.coordinates[0], feature.geometry.coordinates[1]]
// (feature.properties.mag)
// -------------------------------------------------------------------------------------------------------------------
// // Function to determine marker size based on population
// function markerSize(emagnitude) {
//   return emagnitude / 40;
// }

// // Define arrays to hold created city and state markers
// var eqMarkers = [];
// var stateMarkers = [];

// // Loop through locations and create city and state markers
// locations.forEach(function (location) {

//   // Setting the marker radius for the state by passing population into the markerSize function
//   stateMarkers.push(
//     L.circle(location.coordinates, {
//       stroke: false,
//       fillOpacity: 0.75,
//       color: "grey",
//       fillColor: "grey",
//       radius: markerSize(location.state.population)
//     })
//   );

//   // Setting the marker radius for the city by passing population into the markerSize function
//   eqMarkers.push(
//     L.circle(location.coordinates, {
//       stroke: false,
//       fillOpacity: 0.75,
//       color: "purple",
//       fillColor: "purple",
//       radius: markerSize(location.city.population)
//     })
//   );
// });


// -------------------------------------------------------------------------------------------------------------------
// // Perform a GET request to the query URL
// d3.json(link, function (data) {
//   // Once we get a response, create a geoJSON layer containing the features array and add a popup for each marker
//   // then, send the layer to the createMap() function.
//   var earthquakes = L.geoJSON(data.features, {
//     onEachFeature: addPopup
//   });

//   createMap(earthquakes);
// });

// // Define a function we want to run once for each feature in the features array
// function addPopup(feature, layer) {
//   // Give each feature a popup describing the place and time of the earthquake
//   return layer.bindPopup(`<h3> ${feature.properties.place} </h3> <hr> <p> ${Date(feature.properties.time)} </p>`);
// }

// // function to receive a layer of markers and plot them on a map.
// function createMap(earthquakes) {

//   // Define streetmap and darkmap layers
//   var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     maxZoom: 18,
//     id: "streets-v11",
//     accessToken: API_KEY
//   });

//   var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     maxZoom: 18,
//     id: "dark-v10",
//     accessToken: API_KEY
//   });

//   // Define a baseMaps object to hold our base layers
//   var baseMaps = {
//     "Street Map": streetmap,
//     "Dark Map": darkmap
//   };

//   // Create overlay object to hold our overlay layer
//   var overlayMaps = {
//     "Earthquakes": earthquakes
//   };

//   // Create our map, giving it the streetmap and earthquakes layers to display on load
//   var myMap = L.map("map", {
//     center: [20.05, -20.05],
//     zoom: 2,
//     layers: [streetmap, earthquakes]
//   });

//   // Create a layer control
//   // Pass in our baseMaps and overlayMaps
//   // Add the layer control to the map
//   L.control.layers(baseMaps, overlayMaps, {
//     collapsed: false
//   }).addTo(myMap);
// }
// -------------------------------------------------------------------------------------------------------------------