import os
import random
import sys

from events.event_handler import EventHandler
from utils.socket_connection import ServerSocketConnection
from client_screen_handler import ClientScreenHandler
from mock_data import mock_themes


class ClientController(EventHandler):
    def __init__(self, socket, renderer):
        """
        Creates a controller
        """
        self.socket = socket
        self.renderer = renderer
        self.screen_handler = ClientScreenHandler()
        self.renderer.screen_handler = self.screen_handler

    def start_game(self):
        self.trigger("CONTROLLER_START_GAME")

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
        self.renderer.select_themes(theme_list)

        return False

    def send_client_theme_choices(self):
        self.socket.send(self.renderer.selected_themes, "THEME_CHOICE")
