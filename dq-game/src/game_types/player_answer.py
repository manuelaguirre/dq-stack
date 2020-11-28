import sys
import os


class PlayerAnswer:
    """
    Answer of a player after a question
    """

    def __init__(self, player_name, answer):
        self.player_name = player_name
        self.answer = answer
