import sys
import os
from utils.socket_connection import ServerSocketConnection
from events.event_handler import EventHandler
from mock_data import mock_themes


class ClientController(EventHandler):
    def __init__(self, socket, renderer, screen_handler):
        """
        Creates a controller
        """
        self.socket = socket
        self.renderer = renderer
        self.screen_handler = screen_handler

    def start_game(self):
        self.trigger("controller_start_game")

    def get_client_theme_choices(self):
        # Send instruction to choose themes to clients
        print('client controller get client theme choices')
        self.renderer.select_themes(mock_themes)
