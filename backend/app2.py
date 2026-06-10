import csv
import json
from collections import defaultdict
import re
import os
print("Current directory:", os.getcwd())


CSV_PATH = "compact_image_distance_table.csv"
OUTPUT_JSON = "weed_data.json"

# Extract species name from image filename
def extract_species(filename):
    return re.sub(r'\d+\.jpg$', '', filename).replace('_', ' ').strip()

# Load the CSV into a nested dictionary
distances = defaultdict(dict)

with open(CSV_PATH, "r") as f:
    reader = csv.DictReader(f)
    for row in reader:
        img1 = row["x"]
        img2 = row["y"]
        dist = float(row["distance"])
        distances[img1][img2] = dist
        distances[img2][img1] = dist  

# Group images by species
species_map = defaultdict(list)

for image in distances:
    species = extract_species(image)
    species_map[species].append(image)

# Build final JSON structure
output = []

for species, image_list in species_map.items():
    species_entry = {
        "name": species,
        "images": []
    }

    for image in image_list:
        if image not in distances:
            continue
        neighbors = distances[image]
        # Skip self, sort by distance
        sorted_neighbors = sorted(
            [(k, v) for k, v in neighbors.items() if k != image],
            key=lambda x: x[1]
        )
        image_entry = {
            "filename": image,
            "nearest_neighbors": [
                {"image": k, "distance": round(v, 4)}
                for k, v in sorted_neighbors[:10]  # limit to top 10 for compactness
            ]
        }
        species_entry["images"].append(image_entry)

    output.append(species_entry)

# Write to JSON
with open(OUTPUT_JSON, "w") as f:
    json.dump(output, f, indent=4)


