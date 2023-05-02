import pandas as pd

df = pd.read_csv("location_data_with_coordinates.csv")
df.to_json("location_data_with_coordinates.json", orient="records")