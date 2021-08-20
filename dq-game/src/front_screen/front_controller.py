import os
import random
import sys

from events.event_handler import EventHandler
from utils.socket_connection import ServerSocketConnection


class FrontController(EventHandler):
    def __init__(self, socket):
        """
        Creates a controller
        """
        self.socket = socket

    def get_data_from_inbuffer(self, content_type):
        """
        Gets data from inbuffer given some content type
        """
        for msg in self.socket.inbuffer:
            if msg.content_type == content_type:
                self.socket.inbuffer.remove(msg)
                return msg.data
        return False

    def get_username(self):
        return self.get_data_from_inbuffer("data-username")

    def get_theme_list(self):
        """
        Gets the theme list from the inbuffer and returns False if not found
        """
        return self.get_data_from_inbuffer("data-theme-list")

    def get_round_number(self):
        return self.get_data_from_inbuffer("data-round-number")

    def get_current_question(self):
        """
        Gets actual question
        """
        return self.get_data_from_inbuffer("data-question")

    def get_jokers(self):
        """
        Gets jokers
        """
        return self.get_data_from_inbuffer("data-jokers")

    def get_blocking_player(self):
        """
        Gets jokers
        """
        return self.get_data_from_inbuffer("data-blocking-player")

    def get_score_board(self):
        """
        Gets scoreboard
        """
        return self.get_data_from_inbuffer("data-score-board")

    def get_theme(self):
        """
        Gets theme
        """
        return self.get_data_from_inbuffer("data-upcoming-question-theme")

    def get_player_answer_and_status(self):
        """
        Gets answer and whether it's wrong or right
        """
        return self.get_data_from_inbuffer("data-answer-and-status")

    def get_points(self):
        """
        Gets answer and whether it's wrong or right
        """
        return self.get_data_from_inbuffer("data-scores")
