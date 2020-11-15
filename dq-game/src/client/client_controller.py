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

    def get_instructions(self):
        """
        Gets instructions from the inbuffer and returns False if not found
        """
        for msg in self.socket.inbuffer:
            if msg.content_type == "data-instructions":
                return msg.data
        return False

    def ready_up(self):
        print("player send ready confirmation")
        self.socket.send(True, "data-player-ready")

    def get_theme_list(self):
        """
        Gets the theme list from the inbuffer and returns False if not found
        """
        for msg in self.socket.inbuffer:
            if msg.content_type == "data-theme-list":
                return msg.data
        return False

    def get_client_theme_choices(self):
        # Send instruction to choose themes to clients
        theme_list = self.get_theme_list()
        self.trigger("SELECT_THEMES", theme_list)
        return False

    def send_client_theme_choices(self, selected_themes):
        self.socket.send(selected_themes, "data-theme-choice")
