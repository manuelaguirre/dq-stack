import sys
import os


class Round:
    """
    Class to handle a game round
    """

    def __init__(self, theme):
        self.theme = theme
        self.questions = []

    def set_questions(self, questions):
        self.questions = questions
