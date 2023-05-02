import data from './data.js';

let map = L.map('map').setView([-6, 106], 6);

let mapMarker = L.icon({
    iconUrl: '../images/Map_marker.svg',
    iconSize:     [20, 20], // size of the icon
    iconAnchor:   [10, 19], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [0, -20] // point from which the popup should open relative to the iconAnchor
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var marker = L.marker([-6.175247, 106.8270488],{icon: mapMarker}).addTo(map).bindPopup("<b>TESTTESTTEST</b>")
data.forEach(item => {
    console.log(item["Name"],item["Longitude"],item["Latitude"])
    var marker = L.marker([item["Longitude"], item["Latitude"]],{icon: mapMarker}).addTo(map)

    marker.bindPopup("<b>"+item["Name"]+item["Longitude"]+"<br>"+item["Latitude"]+"</b>")
})


