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
let prev = null
let travelDistances = {"Flight":0,"Train":0,"Bus":0,"Taxi":0,"Bike":0,"Other":0,"Total":0}
data.forEach(item => {
    if(item["Latitude"]!=0 & item["Latitude"]!=0){
    console.log(item["Name"],item["Longitude"],item["Latitude"])
    var marker = L.marker([item["Longitude"], item["Latitude"]],{icon: mapMarker}).addTo(map)
    if(prev!=null){
        let backup = true
        let color = 'black'
        switch(prev["Method"]){
            case "Bike":
                color = 'green'
                break;
            case "Taxi":
                color = 'yellow'
                break;
            case "Train":
                color = 'red'
                break;
            case "Bus":
                color = 'blue'
                break;}
        if(prev["Method"] !="Flight" && item["Route"]!=0 &&item["Route"]!={}){
            //console.log(item["Route"])
            let pathjson=JSON.parse(item["Route"])
            //console.log(pathjson)
            if(Object.keys(pathjson).length != 0){
                backup=false
                let latlngs = pathjson["route"]["geometry"]["coordinates"];
                let distance = pathjson["route"]["distance"]
                travelDistances[prev["Method"]]+=distance
                travelDistances["Total"]+=distance
                let polyline = L.polyline(latlngs, {color: color}).addTo(map);
            }
        }
        if(backup){
            let pointA = new L.LatLng(prev["Point"][0], prev["Point"][1]);
            let pointB = new L.LatLng(item["Longitude"], item["Latitude"]);
            let distance = pointA.distanceTo(pointB)
            travelDistances[prev["Method"]]+=distance
                travelDistances["Total"]+=distance
            let pointList = [pointB,pointA]
            let firstpolyline = new L.Polyline(pointList, {
                color: color,
                weight: 3,
                opacity: 0.5,
                smoothFactor: 1
            });
            firstpolyline.addTo(map);
        }
    }
    
    prev={"Method":item["Method"],"Point":[item["Longitude"],item["Latitude"]]}
    marker.bindPopup("<b>"+item["Name"]+item["Longitude"]+"<br>"+item["Latitude"]+"</b>")
}
})
console.log(travelDistances)


