import sys
import os


class Question:
    """
    Question class for instantiating game Questions
    """

    def __init__(self, _id, text, answers, correct_answer):
        self._id = _id
        self.text = text
        self.answers = answers
        self.correct_answer = correct_answer
        self.image_filename = None

    def set_image_filename(self, image_filename):
        self.image_filename = image_filename
