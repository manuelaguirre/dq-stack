from utils.api_handler import APIHandler
from pathlib import Path
import json

api_handler = APIHandler()

results = None
with open(Path(f"src/stats/stats602eb62295bc9200157d3128.json")) as file:
    results = json.load(file)

api_handler.put_results("5ff0fa80379433251ce800d9", results)
