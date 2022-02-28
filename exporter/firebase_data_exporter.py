
# Export firebase data to csv file
# url: https://weddi-app.firebaseio.com/ykyl/posts.json

import requests
from requests.structures import CaseInsensitiveDict
import json
import csv

output_file = "data_file.csv"
database = "weddi-app"
posts_path = "ykyl/posts"

url = f"https://{database}.firebaseio.com/{posts_path}.json"

headers = CaseInsensitiveDict()
headers["Accept"] = "application/json"

resp = requests.get(url, headers=headers)

if resp.status_code != 200:
   resp.raise_for_status()
   
# json to csv
posts_arr = json.loads(resp.text)

data_file = open(output_file, 'w')
csv_writer = csv.writer(data_file)

count = 0
for k,v in posts_arr.items():
    if count == 0:
        header = v.keys()
        csv_writer.writerow(header)
        count += 1

    csv_writer.writerow(v.values())
data_file.close()

