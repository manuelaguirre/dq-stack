import os
import random
import sys

from events.event_handler import EventHandler
from utils.socket_connection import ServerSocketConnection
from client_screen_handler import ClientScreenHandler
from mock_data import mock_themes


class ClientController(EventHandler):
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

    def get_instructions(self):
        """
        Gets instructions from the inbuffer and returns False if not found
        """
        return self.get_data_from_inbuffer("data-instructions")

    def ready_up(self):
        print("player send ready confirmation")
        self.socket.send(True, "data-player-ready")

    def get_theme_list(self):
        """
        Gets the theme list from the inbuffer and returns False if not found
        """
        return self.get_data_from_inbuffer("data-theme-list")

    def get_client_theme_choices(self):
        # Send instruction to choose themes to clients
        theme_list = self.get_theme_list()
        self.trigger("SELECT_THEMES", theme_list)
        return False

    def send_client_theme_choices(self, selected_themes):
        self.socket.send(selected_themes, "data-theme-choice")

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

    def get_score_board(self):
        """
        Gets actual theme
        """
        return self.get_data_from_inbuffer("data-score-board")

    def send_answer(self, answer):
        """
        Sends Client answer
        """
        self.socket.send(answer, "data-answer")
