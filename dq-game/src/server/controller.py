import os
import pickle
import sys

from events.event_handler import EventHandler
from utils.socket_connection import ServerSocketConnection


class Controller(EventHandler):
    def __init__(self, socket, no_of_players):
        """
        Creates a controller
        """
        self.socket = socket
        self.socket.on("GAME_READY_TO_START", self.start)
        self.no_of_players = no_of_players
        self.players = []

    def start(self):
        self.trigger("START_GAME")

    def request_theme_choices(self, theme_list):

        self.socket.send_to_all(theme_list, "data-theme-list")
        self.socket.send_to_all("CHOOSE_THEME", "event")
        self.trigger("THEMES_REQUESTED")

    def get_theme_choices(self):
        result = []
        for message in self.socket.inbuffer:
            if message.content_type == "THEME_CHOICE":
                result.append(message.data)
        print(result)
        return result

    def decide_themes(self, theme_choices, result_size):
        count_dict = {}
        result = []
        for theme_choice in theme_choices:
            for theme in theme_choice:
                if theme not in count_dict:
                    count_dict[theme] = 1
                else:
                    count_dict[theme] += 1
        idx = 0
        while idx < result_size:
            idx += 1
            most_repeated_value = max(count_dict, key=count_dict.get)
            result.append(most_repeated_value)
            del count_dict[most_repeated_value]
        return result

    def await_connections(self):
        self.socket.listen(self.no_of_players)
        self.players = self.socket.clients.keys()
