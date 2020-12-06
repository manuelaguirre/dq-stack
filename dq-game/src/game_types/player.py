import sys
import os
from game_types.joker import Joker, JokerType


class Player:
    """
    Class for the representation of players in the game's Model
    """

    def __init__(self, name):
        self.name = name
        self.points = 0
        self.differential = 0
        self.jokers = []  # self.jokers[0].name
        for jt in JokerType:
            self.jokers.append(Joker(jt))

    def add_points(self, points):
        self.differential = points
        self.points += points
