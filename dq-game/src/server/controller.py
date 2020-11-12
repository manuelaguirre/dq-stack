import os
import pickle
import sys
import time

from events.event_handler import EventHandler
from utils.socket_connection import ServerSocketConnection


class Controller(EventHandler):
    def __init__(self, socket, no_of_players):
        """
        Creates a controller
        """
        self.socket = socket
        self.no_of_players = no_of_players
        self.players = []

    def request_theme_choices(self, theme_list):

        self.socket.send_to_all(theme_list, "data-theme-list")
        self.socket.send_to_all("CHOOSE_THEME", "event")

    def get_theme_choices(self, theme_list):
        self.request_theme_choices(theme_list)
        result = []

        while len(result) < self.no_of_players:
            for message in self.socket.inbuffer:
                if message.content_type == "data-theme-choice":
                    result.append(message.data)
                    self.socket.inbuffer.remove(message)
            time.sleep(0.5)
        result = self.decide_themes(result, 3)
        print("Themes will be ", result)
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

    def request_confirmations(self):
        players_ready = []
        while len(players_ready) < self.no_of_players:
            for message in self.socket.inbuffer:
                if message.content_type == "data-player-ready":
                    players_ready.append(message.origin)
                    self.socket.inbuffer.remove(message)
        return players_ready
