from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware 
from fastapi.staticfiles import StaticFiles
from typing import Optional, List
import json
import random
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="weed_dataset/images"), name="static")

DATA_PATH = "full_neighbor_map.json"
with open(DATA_PATH, "r") as f:
    species_data = json.load(f)


@app.get("/generate-grid")
def generate_grid(difficulty: str = Query("easy", enum=["easy", "hard"]), 
                  missed: str = Query("", alias="missed")
):
    #missed_list = missed.split(",") if missed else []
    difficulty_levels = {
        "easy": (0.0, 1.5),
        "hard": (0.0, 0.7)
    }
    min_dist, max_dist = difficulty_levels[difficulty]

    with open("full_neighbor_map.json", "r") as f:
        neighbor_map = json.load(f)

    # Get all species from filenames 
    all_species = list({img.split("/")[0] for img in neighbor_map})
    missed_species = [s for s in missed.split(",") if s in all_species] if missed else []
    selected_species = (
        list(set(missed) if missed else random.sample(all_species, 3))
    )
    species_to_use = missed_species if missed_species else random.sample(all_species, 3)
    game_cards = []

    for species in selected_species:
        # Get all images of this species
        species_images = [img for img in neighbor_map if img.startswith(species)]
        if not species_images:
            continue
        base_img = random.choice(species_images)

        valid_matches = [
            neighbor["image"] for neighbor in neighbor_map[base_img]
            if min_dist <= neighbor["distance"] <= max_dist
               and neighbor["image"].split("/")[0] == species  # same species
        ]

        if not valid_matches:
            continue  # skip if no valid match for this image

        match_img = random.choice(valid_matches)

        game_cards.append({
            "name": species,
            "img1": base_img,
            "img2": match_img
        })
   #if we don't have enough cards in our grid after adding the missed species
    while len(game_cards) < 3:
        fallback_species = random.choice(all_species)
        if fallback_species in species_to_use:
            continue

        species_images = [img for img in neighbor_map if img.startswith(fallback_species)]
        if not species_images:
            continue

        base_img = random.choice(species_images)
        valid_matches = [
            neighbor["image"] for neighbor in neighbor_map[base_img]
            if min_dist <= neighbor["distance"] <= max_dist and
               neighbor["image"].split("/")[0] == fallback_species
        ]

        if not valid_matches:
            continue

        match_img = random.choice(valid_matches)
        game_cards.append({
            "name": fallback_species,
            "img1": base_img,
            "img2": match_img
        })
    
    return game_cards


