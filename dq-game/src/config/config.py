import os
import sys
import json
import re
from pathlib import Path


def get(option):
    filename = Path("src/config/config.json")
    with open(filename, "rb") as file:
        result = json.load(file)
        for arg in parse_option(option):
            result = result[arg]
        if result == "true":
            return True
        elif result =="false":
            return False
        else:          
            try:
                return int(result)
            except ValueError:
                return result


def parse_option(option):
    regex = re.compile(r"\w+(\.\w+)*")
    if not regex.fullmatch(option):
        raise RuntimeError("Invalid argument. Must be a dot notation")
    return option.split(".")
