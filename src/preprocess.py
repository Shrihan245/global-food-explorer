import json
import pandas as pd
from collections import Counter


with open('data/raw/train.json') as f:
    data = json.load(f)

df = pd.DataFrame(data)


cuisine_counts = df['cuisine'].value_counts().reset_index()
cuisine_counts.columns = ['cuisine', 'count']
cuisine_counts.to_json('data/processed/cuisine_counts.json', orient='records')


top_ingredients = {}
for cuisine, group in df.groupby('cuisine'):
    all_ingredients = [i for sublist in group['ingredients'] for i in sublist]
    top_ingredients[cuisine] = [{'ingredient': k, 'count': v} 
                                  for k, v in Counter(all_ingredients).most_common(10)]

with open('data/processed/top_ingredients.json', 'w') as f:
    json.dump(top_ingredients, f)


common = df.explode('ingredients').groupby('ingredients')['cuisine'].apply(list)
shared = common[common.apply(len) > 5].reset_index()
shared.columns = ['ingredient', 'cuisines']
shared['cuisine_count'] = shared['cuisines'].apply(len)
shared.to_json('data/processed/shared_ingredients.json', orient='records')

print("Done! Check data/processed/")