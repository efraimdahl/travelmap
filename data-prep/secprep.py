from geopy.geocoders import Nominatim

"""
import http.client

conn = http.client.HTTPSConnection("trueway-directions2.p.rapidapi.com")

headers = {
    'X-RapidAPI-Key': "21f687d5f8msh6d2d0193f39334ep124091jsnd90d4edb8de5",
    'X-RapidAPI-Host': "trueway-directions2.p.rapidapi.com"
}
	
pointA = (-6.175247,106.8270488)
pointB = (-7.9778384,110.3672257)

reqstring = f'{pointA[0]},{pointA[1]};{pointB[0]},{pointB[1]}'

conn.request("GET", f"/FindDrivingRoute?stops={reqstring}", headers=headers)

res = conn.getresponse()
data = res.read()

with open("secprep.json", "wb") as f:
    f.write(data)
f.close()
"""

def geocode_location(row):
    """
    Returns the latitude and longitude of a given location string
    using the Nominatim geocoding service.
    """
    if((row['Longitude'] != 0 and row['Latitude'] != 0)):
        longitude, latitude = (row['Longitude'],row['Latitude'])
        return row['Latitude'],row["Longitude"]
    if(row["Include"]=="No"):
        return 0,0
    geolocator = Nominatim(user_agent="my-app")
    location = f'{row["City"]},{row["Country"]}'
    print("Geolocating "+ location)
    try:
        location_data = geolocator.geocode(location)
        latitude = location_data.latitude
        longitude = location_data.longitude
    except:
        latitude = None
        longitude = None
        
    return latitude, 


geolocator = Nominatim(user_agent="my-app")
location_data = geolocator.geocode("Reckong Peo, India")
latitude = location_data.latitude
longitude = location_data.longitude
print(latitude,longitude)