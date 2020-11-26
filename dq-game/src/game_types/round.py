import sys
import os


class Round:
    """
    Class to handle a game round
    """

    def __init__(self):
        self.questions = []

    def set_questions(self, questions):
        self.questions = questions
