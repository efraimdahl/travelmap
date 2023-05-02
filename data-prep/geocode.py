import pandas as pd
from geopy.geocoders import Nominatim

'''

print("Hello")
geolocator = Nominatim(user_agent="TravelMaps")
location = geolocator.geocode("175 5th Avenue NYC")
print((location.latitude, location.longitude))
print(location.raw)

'''

#returns longitude and latitude given a string, default 0,0
def geocode_location(location):
    """
    Returns the latitude and longitude of a given location string
    using the Nominatim geocoding service.
    """
    geolocator = Nominatim(user_agent="my-app")
    try:
        location_data = geolocator.geocode(location)
        latitude = location_data.latitude
        longitude = location_data.longitude
    except:
        latitude = None
        longitude = None
        
    return latitude, longitude
    

# load the dataframe of location names
df = pd.read_csv('staysOrig.csv')
print(df.columns)
# create empty lists to store the latitude and longitude data
latitudes = []
longitudes = []

df = df = df[df['Include'] == "Yes"]
# iterate through the locations in the dataframe and retrieve their latitude and longitude data
for index, row in df.iterrows():
    if((row['Longitude'] != 0 and row['Latitude'] != 0) or (row['Latitude'] != 'nan' and row['Longitude'] != 'nan')):
        latitudes.append(row['Latitude'])
        longitudes.append(row['Longitude'])
    else:
        print(row['City'])
        location = f"{row['City']}, {row['Country']}"
        latitude, longitude = geocode_location(location)
        latitudes.append(latitude)
        longitudes.append(longitude)
    

# add the latitude and longitude data to the dataframe
df['Latitude'] = latitudes
df['Longitude'] = longitudes

# save the dataframe to a csv file
df.to_csv('location_data_with_coordinates.csv', index=False)
df.to_json("location_data_with_coordinates.json", orient="records")
