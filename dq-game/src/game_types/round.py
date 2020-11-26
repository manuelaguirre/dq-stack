import sys
import os


class Round:
    """
    Class to handle a game round
    """

    def __init__(self, number):
        self.questions = []
        self.number = number
        self.instructions = []

    def set_questions(self, questions):
        self.questions = questions
