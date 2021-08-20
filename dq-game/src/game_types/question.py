import sys
import os


class Question:
    """
    Question class for instantiating game Questions
    """

    def __init__(self, _id, text, answers, correct_answer, theme):
        self._id = _id
        self.text = text
        self.answers = answers
        self.correct_answer = correct_answer
        self.image_filename = None
        self.theme = theme

    def set_image_filename(self, image_filename):
        self.image_filename = image_filename

    def get_answer_letter(self, answer):
        try:
            index = self.answers.index(answer)
        except:
            return None
        return chr(index + 65)
