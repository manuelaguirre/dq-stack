import sys
import os

from enum import Enum


class JokerType(Enum):
    """
    Joker \n
    Types: DOUBLE, FIFTYFIFTY, BLOCK, STEAL
    """

    DOUBLE = 0
    FIFTYFIFTY = 1
    BLOCK = 2
    STEAL = 3


class Joker:
    def __init__(self, joker_type):
        self.joker_type = joker_type  # TODO: verify enum exists
