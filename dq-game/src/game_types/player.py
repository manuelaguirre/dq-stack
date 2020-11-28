import sys
import os


class Player:
    """
    Class for the representation of players in the game's Model
    """

    def __init__(self, name):
        self.name = name
        self.points = 0
        self.differential = 0
        self.jokers = []

    def add_points(self, points):
        self.differential = points
        self.points += points
