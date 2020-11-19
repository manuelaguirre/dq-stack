import sys
import os


class Question:
    """
    Question class for instantiating game Questions
    """

    def __init__(self, _id, text, answers, correct_answer, attachment=None):
        self._id = _id
        self.text = text
        self.answers = answers
        self.correct_answer = correct_answer
        self.attachment = attachment

    def set_image(self, image):
        self.attachment = image
