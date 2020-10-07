import sys
import os

class Question:
    """
    Question class for instantiating game Questions
    """
    def __init__(self, prompt, answers, correct_answer, attachment=None):
        self.prompt = prompt
        self.answers = answers
        self.correct_answer= correct_answer
        self.attachment = attachment
    
        
    