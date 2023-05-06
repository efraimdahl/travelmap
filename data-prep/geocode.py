import pandas as pd
import re
from geopy.geocoders import Nominatim
import http.client
import API_Keys as ak #local file where I'm storing the API keys, youll have to get your own if youre working from this
#the api i'm using is Trueway Directions and i got it via RapidAPI, they offer 1000 free requests per day
'''

print("Hello")
location = geolocator.geocode("175 5th Avenue NYC")
print((location.latitude, location.longitude))
print(location.raw)

'''

#returns the path to a given direction as a list of coordinates
def waypoint_calc(prev,row,resdf):
    if(prev==[] or row["Include"]=="No"):
        return 0
    if(prev[2]=="Flight"):
        return 0
    if(row["Route"]==1):
        print("route to "+f'{row["Name"]},{row["City"]}' +"has previously been calculated, fetching from dataframe")
        if row["Name"]=="Travel Point":
            route = resdf.loc[resdf['City']==row["City"]]
        else:
            route = resdf.loc[resdf['Date In'] == row['Date In']]
        try:
            return route["Route"].values[0]
        except:
            return 0
    else:
        pointA=(prev[1],prev[0])
        pointB=(row['Longitude'],row['Latitude'])
        print("Calculating route:", pointA,pointB,row["Name"],row["City"])
        host = ak.X_RAPID_API_HOST
        key = ak.X_RAPID_API_KEY
        conn = http.client.HTTPSConnection(host)
        
        
        headers = {
            'X-RapidAPI-Key': key,
            'X-RapidAPI-Host': host
        }
        
        reqstring = f'{pointA[0]},{pointA[1]};{pointB[0]},{pointB[1]}'
        conn.request("GET", f"/FindDrivingRoute?stops={reqstring}", headers=headers)

        res = conn.getresponse()
        print(res)
        data = res.read().decode("utf-8")
        data=re.sub(r"\s+", "", data)
        #print(data)
        return data

#returns longitude and latitude given a string, default 0,0
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
    geolocator = Nominatim(user_agent="TravelMaps")
    location = f'{row["City"]}, {row["Country"]}'
    print("Geolocating "+ location)
    location_data = geolocator.geocode("Reckong Peo, India")
    latitude = location_data.latitude
    longitude = location_data.longitude 
    return longitude,latitude
    

# load the dataframe of location names
df = pd.read_csv('staysOrig.csv')
resdf = pd.read_csv('location_data_with_coordinates.csv')
print(df.columns)
# create empty lists to store the latitude and longitude data
latitudes = []
longitudes = []
routes = []
df=df.fillna(0)
prev = []
# iterate through the locations in the dataframe and retrieve their latitude and longitude data
for index, row in df.iterrows():
    latitude,longitude = geocode_location(row)
    latitudes.append(latitude)
    longitudes.append(longitude)
    row["Latitude"]=latitude
    row["Longitude"]=longitude
    route=waypoint_calc(prev,row,resdf)
    routes.append(route)
    if(row["Include"]!="No"):
        prev=[latitude,longitude,row["Method"]]
    

    
# add the latitude and longitude data to the dataframe
df['Latitude'] = latitudes
df['Longitude'] = longitudes
df['Route'] = routes

# save the dataframe to a csv file
df.to_csv('location_data_with_coordinates.csv', index=False)
str = df.to_json(orient="records")

with open("../web/js/data.js","w") as file:
    res = "const data="+str+"\n"+"export default data"
    file.write(res)
    file.close()
