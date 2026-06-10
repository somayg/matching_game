import csv 
import json


with open('REUProject_WeedsList.csv', mode='r', encoding='utf-8-sig') as csvfile:
  reader = csv.DictReader(csvfile)
  data = []
  for row in reader:
      cleaned_row = {
         (key.strip() if key else ''): (value.strip() if value else '')
         for key, value in row.items()
      }
      data.append(cleaned_row)
#     data = list(csv.DictReader(csvfile))

with open('data.json', mode='w', encoding='utf-8') as jsonfile:
    json.dump(data, jsonfile, indent=4)
