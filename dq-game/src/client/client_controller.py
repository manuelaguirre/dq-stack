import os
import random
import sys

from events.event_handler import EventHandler
from utils.socket_connection import ServerSocketConnection


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
        print("client controller get client theme choices")
        theme_list = self.get_theme_list()

        def choose_random_theme(theme_list):
            """
            Takes 3 themes at random
            """
            choices = []
            while len(choices) < 3:
                choice = random.choice(theme_list)
                if choice not in choices:
                    choices.append(choice)
            return choices

        choices = choose_random_theme(theme_list)
        self.socket.send(choices, "THEME CHOICE")

        return False
