import sys
import os


class Theme:
    """
    Theme class for game themes
    """
    def __init__(self, _id, name, description):
        self._id = _id
        self.name = name
        self.description = description
