// Link from USGS for 30days of earthquakes (significant and > 4.5 )

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

// --------------------------------------------------------------------------------------------------------------------
// RUN GET TO GRAB DATA FROM THE GEOJSON LINK AND BOUNDARIES JSON
// --------------------------------------------------------------------------------------------------------------------
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

  // Perform a GET request to the query the boundaries json
  d3.json("static/data/PB2002_boundaries.json", function (plateData) {
    var boundaryLines = plateData.features
    // Once we get a response, create a geoJSON layer containing the features array and add a popup for each marker
    // then, send the layer to the createMap() function.
    var plateBoundaryLines = L.geoJSON(plateData.features, {
      onEachFeature: makePolyLine,
      style: {
        color: 'black',
        weight: 5,
        opacity: 0.5,
        smoothFactor: 1
      }
    });

    // console.log(plateBoundaryLines)
    createMap(earthquakes, plateBoundaryLines);
  });
});
// --------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR creating THE EARTHQUAKE CIRCLES
// --------------------------------------------------------------------------------------------------------------------
function makeCircles(feature, layer) {

  // Loop through the earthquake incdents to select approriate color for each based on the depth.

  var eqcolor = "";

  if (feature.geometry.coordinates[2] > 250) {
    eqcolor = "#661400";
  }
  else if (feature.geometry.coordinates[2] > 150) {
    eqcolor = "#A31A0E";
  }
  else if (feature.geometry.coordinates[2] > 100) {
    eqcolor = "#DF554D";
  }
  else if (feature.geometry.coordinates[2] > 50) {
    eqcolor = "#54CC65";
  }
  else {
    eqcolor = "#19F52A";
  }

  // Setting the marker radius for the city by passing population into the markerSize function
  eqMarkers.push(
    L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
      stroke: false,
      fillOpacity: 0.75,
      color: "black",
      fillColor: eqcolor,
      radius: ((feature.properties.mag) * 50000),
    }).bindPopup(`<h3>Location:${feature.properties.place}</h3> <hr> <h3>Magnitude:${feature.properties.mag}</h3> <h3>Depth: ${feature.geometry.coordinates[2]}</h3>`),
  );
}

// --------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR PLATE BOUNDARIES
// --------------------------------------------------------------------------------------------------------------------

function makePolyLine(feature, layer) {
  // Coordinates for each point to be used in the polyline
  var platePointList = feature.geometry.coordinates;
  var polyline = new L.polyline(platePointList)
  // console.log(platePointList);
  // console.log(polyline);

  plateLines.push(polyline);
  return polyline
  // console.log(plateLines);
}

// --------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR CREATING THE MAP
// --------------------------------------------------------------------------------------------------------------------
function createMap(earthquakes, plates) {
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

  // Create two separate layer groups: one for earthquakes and one for the plate boundaries
  var earthquakes = L.layerGroup(eqMarkers);
  var plateBoundary = plates;

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

  // Create and add a legend to map
  // Create an object legend
  var legend = L.control({ position: 'bottomleft' });
  legend.onAdd = function (myMap) {

    // details for the legend
    var div = L.DomUtil.create('div', 'info legend');
    labels = ['<strong>Depths</strong>'];
    var depths = ['> 250ft', '> 150ft', '> 100ft', '> 50ft', '< 50ft'];
    var Lcolors = ["#661400", "#A31A0E", "#DF554D", "#DF554D", "#19F52A"]

    // Looping through
    for (var i = 0; i < depths.length; i++) {

      div.innerHTML +=
        labels.push(
          '<i class="square" style="background:' + (Lcolors[i]) + '"></i> ' +
          depths[i] + (depths[i + 1] ? "  -  " + depths[i + 1] + "<br>" : '+'));

    }
    div.innerHTML = labels.join('<br>');
    return div;
  };
  // Finally, we add our legend to the map.
  legend.addTo(myMap);

  // Pass our map layers into our layer control
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

// // ====================================================================================================================
// // Link from USGS for 30days of earthquakes (significant and > 4.5 )

// var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
// var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

// // --------------------------------------------------------------------------------------------------------------------
// // RUN GET TO GRAB DATA FROM THE GEOJSON LINK AND BOUNDARIES JSON
// // --------------------------------------------------------------------------------------------------------------------
// // Define arrays to hold created earthquake markers and plate boundary polyline
// var eqMarkers = [];
// var plateLines = [];

// // // Perform a GET request to the query URL
// d3.json(link, function (data) {
//   // Once we get a response, create a geoJSON layer containing the features array and add a popup for each marker
//   // then, send the layer to the createMap() function.
//   var earthquakes = L.geoJSON(data.features, {
//     onEachFeature: makeCircles
//   });

// // Perform a GET request to the query the boundaries json
//   d3.json("static/data/PB2002_boundaries.json", function (plateData) {
//     var boundaryLines = plateData.features
//     // Once we get a response, create a geoJSON layer containing the features array and add a popup for each marker
//     // then, send the layer to the createMap() function.
//     var plateBoundaryLines = L.geoJSON(plateData.features, {
//       onEachFeature: makePolyLine
//     });

//     // console.log(plateBoundaryLines)
//     createMap(earthquakes, plateBoundaryLines);
//   });
// });
// // --------------------------------------------------------------------------------------------------------------------
// // FUNCTION FOR creating THE EARTHQUAKE CIRCLES
// // --------------------------------------------------------------------------------------------------------------------
// function makeCircles(feature, layer) {

//   // Loop through the earthquake incdents to select approriate color for each based on the depth.

//   var eqcolor = "";

//   if (feature.geometry.coordinates[2] > 250) {
//     eqcolor = "#F51816";
//   }
//   else if (feature.geometry.coordinates[2] > 150) {
//     eqcolor = "#F73C0F";
//   }
//   else if (feature.geometry.coordinates[2] > 100) {
//     eqcolor = "#E06419";
//   }
//   else if (feature.geometry.coordinates[2] > 50) {
//     eqcolor = "#F7940F";
//   }
//   else {
//     eqcolor = "#F5B111";
//   }

//   // Setting the marker radius for the city by passing population into the markerSize function
//   eqMarkers.push(
//     L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
//       stroke: false,
//       fillOpacity: 0.75,
//       color: "black",
//       fillColor: eqcolor,
//       radius: ((feature.properties.mag) * 50000),
//     })(`<h3>Location:${feature.properties.place}</h3> <hr> <h3>Magnitude:${feature.properties.mag}</h3> <br> <h3>Depth: ${feature.geometry.coordinates[2]}</h3>`),
//   );
// }

// // --------------------------------------------------------------------------------------------------------------------
// // FUNCTION FOR PLATE BOUNDARIES
// // --------------------------------------------------------------------------------------------------------------------

// function makePolyLine(feature, layer) {
//   // Coordinates for each point to be used in the polyline
//   var platePointList = (feature.geometry.coordinates);

//   // To go from lng lat to lat lng on the platePointList coordinates
//   var fixedplatePointList = platePointList.map(function (coord) {
//     return [coord[1], coord[0]]
//   })
//   // console.log(platePointList);
//   console.log(fixedplatePointList);

//   // create the poly line
//   var polyline = new L.polyline(fixedplatePointList, {
//     color: 'purple',
//     weight: 5,
//     opacity: 0.5,
//     smoothFactor: 1
//   })

//   plateLines.push(
//     polyline
//   );
//   return polyline
//   // console.log(plateLines);
// }

// // --------------------------------------------------------------------------------------------------------------------
// // FUNCTION FOR CREATING THE MAP
// // --------------------------------------------------------------------------------------------------------------------
// function createMap(earthquakes, plates) {
//   // Define variables for our base layers
//   var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     maxZoom: 10,
//     id: "streets-v11",
//     accessToken: API_KEY
//   });

//   var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     maxZoom: 10,
//     id: "dark-v10",
//     accessToken: API_KEY
//   });

//   // Create two separate layer groups: one for earthquakes and one for the plate boundaries
//   var earthquakes = L.layerGroup(eqMarkers);
//   var plateBoundary = L.layerGroup(plateLines);
//   // var plateBoundary = plates

//   // Create a baseMaps object
//   var baseMaps = {
//     "Street Map": streetmap,
//     "Dark Map": darkmap
//   };

//   // Create an overlay object
//   var overlayMaps = {
//     "earthquake Overlay": earthquakes,
//     "plateBoundary Overlay": plateBoundary,
//   };

//   // Define a map object
//   var myMap = L.map("map", {
//     center: [35.00, 0.00],
//     zoom: 3,
//     layers: [darkmap, earthquakes, plateBoundary]
//   });

// // Create and add a legend to map
//   // Create an object legend
//   var legend = L.control({ position: 'bottomleft' });
//   legend.onAdd = function (myMap) {

//     // details for the legend
//     var div = L.DomUtil.create('div', 'info legend');
//     labels = ['<strong>Depths</strong>'];
//     var depths = ['> 250ft', '> 150ft', '> 100ft', '> 50ft', '< 50ft'];
//     var Lcolors = ["#661400", "#A31A0E", "#DF554D", "#DF554D", "#19F52A"]

//     // Looping through
//     for (var i = 0; i < depths.length; i++) {

//       div.innerHTML +=
//         labels.push(
//           '<i class="square" style="background:' + (Lcolors[i]) + '"></i> ' +
//           depths[i] + (depths[i + 1] ? "  -  " + depths[i + 1] + "<br>" : '+'));

//     }
//     div.innerHTML = labels.join('<br>');
//     return div;
//   };
//   // Finally, we add our legend to the map.
//   legend.addTo(myMap);

//   // Pass our map layers into our layer control
//   // Add the layer control to the map
//   L.control.layers(baseMaps, overlayMaps, {
//     collapsed: false
//   }).addTo(myMap);
// }