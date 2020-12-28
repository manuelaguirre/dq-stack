import sys
import os
from game_types.joker import Joker, JokerType


class Player:
    """
    Class for the representation of players in the game's Model
    """

    def __init__(self, name, _id):
        self.name = name
        self._id = _id
        self.points = 0
        self.differential = 0
        self.jokers = []  # self.jokers[0].name
        for jt in JokerType:
            self.jokers.append(Joker(jt))
            self.jokers.append(Joker(jt))

    def add_points(self, points):
        self.differential = points
        self.points += points

    def double_differential(self):
        self.points += self.differential
        self.differential *= 2

    def consume_joker(self, joker_type):
        for index, joker in enumerate(self.jokers):
            if joker_type == joker.joker_type.name:
                # TODO: REFACTOR JOKERS
                self.jokers.pop(index)
                break
