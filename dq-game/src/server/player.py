import sys
import os


class Player:
    """
    Class for the representation of players in the game's Model
    """

    def __init__(self, name):
        self.name = name
        points = 0
        jokers = []
