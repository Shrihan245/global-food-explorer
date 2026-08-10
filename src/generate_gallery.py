"""
Generate a lightweight manifest of sample dish photos for the gallery section.

We have ~13,800 photos total, far too many to load on one page. Instead,
we randomly sample a handful per cuisine and write out just their file
paths — the actual images stay where they are; this script only builds
a small JSON pointer file the frontend can fetch quickly.
"""
import os
import json
import random

DISHES_DIR = "data/raw/Dishes"
OUTPUT_PATH = "data/processed/gallery_photos.json"
PHOTOS_PER_CUISINE = 8
SEED = 42  # fixed seed so the same "random" photos are picked every run

random.seed(SEED)

gallery = []

for cuisine in sorted(os.listdir(DISHES_DIR)):
    cuisine_path = os.path.join(DISHES_DIR, cuisine)
    if not os.path.isdir(cuisine_path):
        continue

    images = [f for f in os.listdir(cuisine_path) if f.lower().endswith((".jpg", ".jpeg", ".png"))]
    sample = random.sample(images, min(PHOTOS_PER_CUISINE, len(images)))

    for filename in sample:
        gallery.append({
            "cuisine": cuisine,
            "path": f"data/raw/Dishes/{cuisine}/{filename}"
        })

with open(OUTPUT_PATH, "w") as f:
    json.dump(gallery, f, indent=2)

print(f"Done! Sampled {len(gallery)} photos across {len(os.listdir(DISHES_DIR))} cuisines.")
print(f"Saved to {OUTPUT_PATH}")