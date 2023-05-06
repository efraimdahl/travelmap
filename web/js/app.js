import data from './data.js';
import states1 from './border_states.js';
let map = L.map('map').setView([-6, 106], 6);

let mapMarker = L.icon({
    iconUrl: '../images/Map_marker.svg',
    iconSize:     [10, 10], // size of the icon
    iconAnchor:   [5, 9], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [0, -20] // point from which the popup should open relative to the iconAnchor
});

var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

let prev = null
let travelDistances = {"Flight":0,"Train":0,"Bus":0,"Taxi":0,"Bike":0,"Other":0,"Total":0}

//This function displays the metrics and adds conditional styling.
function display_distance(){
    let total = document.getElementById("ti_total")
    let bike = document.getElementById("ti_bike")
    let train = document.getElementById("ti_train")
    let flight = document.getElementById("ti_flight")
    let bus = document.getElementById("ti_bus")
    let taxi = document.getElementById("ti_taxi")
    let other = document.getElementById("ti_other")

    total.innerHTML = "Total Distance: "+String(Math.round(travelDistances["Total"]/1000))+" km"
    bike.innerHTML = "Bike Distance: "+String(Math.round(travelDistances["Bike"]/1000))+" km"
    train.innerHTML = "Train Distance: "+String(Math.round(travelDistances["Train"]/1000))+" km"
    flight.innerHTML = "Flight Distance: "+String(Math.round(travelDistances["Flight"]/1000))+" km"
    bus.innerHTML = "Bus Distance: "+String(Math.round(travelDistances["Bus"]/1000))+" km"
    taxi.innerHTML = "Taxi Distance: "+String(Math.round(travelDistances["Taxi"]/1000))+" km"
    other.innerHTML = "Other Distance: "+String(Math.round(travelDistances["Other"]/1000))+" km"

    let bike_lines = document.getElementsByClassName("Bike_line")
    let train_lines = document.getElementsByClassName("Train_line")
    let flight_lines = document.getElementsByClassName("Flight_line")
    let bus_lines = document.getElementsByClassName("Bus_line")
    let taxi_lines = document.getElementsByClassName("Taxi_line")
    let other_lines = document.getElementsByClassName("Other_line")

    let arr1 = [bike,train,flight,bus,taxi,other]
    let arr2 = [bike_lines,train_lines,flight_lines,bus_lines,taxi_lines,other_lines]
    for (let i = 0;i<arr1.length;i++){
        console.log(arr1[i])
        arr1[i].addEventListener("click",()=>{
            arr1[i].classList.toggle("clickedItem")
            for (let item of arr2[i]) {
                console.log(item)
                item.classList.toggle("Selected_line")     
            }
        })
    }
    
}

//This function displays the metrics and adds conditional styling.

function style(feature) {
    return {
        fillColor: '#FFEDA0',
        weight: 0.1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.2
    };
}

L.geoJson(states1, {style: style}).addTo(map);
data.forEach(item => {
    if(item["Latitude"]!=0 & item["Latitude"]!=0){
    console.log(item["Name"],item["Longitude"],item["Latitude"])
    var marker = L.marker([item["Longitude"], item["Latitude"]],{icon: mapMarker}).addTo(map)
    marker._icon.classList.add("huechange");
    if(prev!=null){
        let backup = true
        
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
                let polyline = L.polyline(latlngs, {
                    className:prev["Method"]+"_line",
                }).addTo(map);
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
                className:prev["Method"]+"_line",
            });
            firstpolyline.addTo(map);
            
        }
    }
    prev={"Method":item["Method"],"Point":[item["Longitude"],item["Latitude"]]}
    if(item["Name"]!="Travel Point"){
        let popup_content = `<b class=popup_title>${item["City"]}, ${item["Country"]}</b><br> 
        ${item["Name"]}<br> Duration: ${item["Duration"]} Days`
        if(item["Link"]!=0){
            popup_content = `<a href=${item["Link"]} class="popup_title"><b>${item["City"]}, ${item["Country"]}</b></a><br> 
        ${item["Name"]}<br> Duration: ${item["Duration"]} Days`
        }
        marker.bindPopup(popup_content)
    }
}
})
display_distance()

console.log(travelDistances)


