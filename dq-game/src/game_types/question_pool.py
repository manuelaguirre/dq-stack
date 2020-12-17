import os
import sys
from game_types.theme import Theme
from game_types.question import Question
from random import shuffle


class QuestionPool:
    def __init__(self, theme, questions):
        theme = Theme(theme["_id"], theme["name"], theme["description"])
        self.theme = theme
        self.questions = self.create_questions(questions)

    def create_questions(self, questions):
        result = []
        for question in questions:

            answers = [
                question["answer1"],
                question["answer2"],
                question["answer3"],
                question["answer4"],
            ]

            correct_answer = answers.index(question["answer1"])
            shuffle(answers)

            question_object = Question(
                question["_id"],
                question["text"],
                answers,
                correct_answer,
                self.theme,
            )
            if "image" in question:
                question_object.set_image_filename(question["image_filename"])
            result.append(question_object)
        return result
