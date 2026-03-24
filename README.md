# global-food-explorer

A scroll-driven, interactive data story built with D3.js — exploring global cuisines, signature ingredients, and the surprising connections between food cultures worldwide.

**Live demo:** [https://shrihan245.github.io/global-food-explorer/](https://shrihan245.github.io/global-food-explorer/)

## What It Does

| Section | Description |
|---|---|
| Cuisines | Animated bar chart ranking 20 world cuisines by recipe count |
| Ingredients | Interactive explorer — click any cuisine to see its top 10 ingredients |
| Connections | Horizontal bar chart revealing ingredients shared across the most cuisines |

## Tech Stack

- **Data processing** — Python 3, pandas
- **Visualization** — D3.js v7
- **Scroll interactions** — Scrollama.js
- **Images** — Unsplash API (dynamic cuisine photos)
- **Frontend** — Vanilla HTML5, CSS3, JavaScript
- **Dev tools** — Git, GitHub, GitHub Pages

No frameworks. No React. Built from scratch with D3 and vanilla JS.

## Features

- Animated bar chart with hover tooltips showing cuisine name and recipe count
- 20 interactive cuisine buttons — each updates the ingredient chart dynamically
- Scroll-driven layout with smooth section transitions
- Live food photography pulled from Unsplash API on every cuisine click
- Shared ingredients analysis — shows what connects cuisines across the globe
- Fully deployed as a static site via GitHub Pages

## Data Source

[Kaggle — Recipe Ingredients Dataset](https://www.kaggle.com/datasets/kaggle/recipe-ingredients-dataset)

39,774 recipes across 20 cuisines, preprocessed with pandas into three JSON files:
- `cuisine_counts.json` — recipe count per cuisine
- `top_ingredients.json` — top 10 ingredients per cuisine
- `shared_ingredients.json` — ingredients appearing across the most cuisines

## Project Structure
```
global-food-explorer/
├── index.html               # Main page (D3 visualizations)
├── style.css                # Full custom stylesheet
├── main.js                  # D3.js + Scrollama + Unsplash API logic
├── data/
│   ├── raw/
│   │   └── train.json       # Original Kaggle dataset
│   └── processed/
│       ├── cuisine_counts.json
│       ├── top_ingredients.json
│       └── shared_ingredients.json
└── src/
    └── preprocess.py        # pandas preprocessing script
```

## Run Locally
```bash
# 1. Clone the repo
git clone https://github.com/Shrihan245/global-food-explorer.git
cd global-food-explorer

# 2. Set up Python environment
python3 -m venv venv
source venv/bin/activate

# 3. Install dependencies
pip install pandas

# 4. Run preprocessing (optional — processed files already included)
python3 src/preprocess.py

# 5. Start local server
python3 -m http.server 8000
```

Open `http://localhost:8000` in your browser.

## What I Learned

- D3.js scales, axes, and SVG rendering from scratch
- Animated transitions and enter/update/exit patterns in D3
- Scroll-driven storytelling with Scrollama.js
- Data preprocessing and JSON export with pandas
- Fetching and displaying live data from a REST API (Unsplash)
- Deploying a static site with GitHub Pages
- Structuring a data pipeline: raw data → processed JSON → visualization

## Roadmap

- Fix hover tooltips on bar charts
- Add world map showing cuisine origins
- Ingredient overlap network diagram (force-directed graph)
- Mobile responsive layout
- Add more cuisines from extended dataset

## Author

Shrihan Bodapati — Built as a portfolio project to learn D3.js and data visualization through the lens of global food culture.

[GitHub](https://github.com/Shrihan245) · [LinkedIn](https://www.linkedin.com/in/shrihan-bodapati)