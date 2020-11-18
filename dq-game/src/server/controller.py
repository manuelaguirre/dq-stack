import os
import pickle
import random
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
        self.is_timeout = False

    def timeout(self):
        self.is_timeout = True
        self.socket.send_to_all("TIMEOUT", "event")

    def await_connections(self):
        self.socket.listen(self.no_of_players)
        self.players = self.socket.clients.keys()

    def send_instructions_and_await_confirmations(self, instructions):
        self.socket.send_to_all(instructions, "data-instructions")
        self.socket.send_to_all("SHOW_INSTRUCTIONS_AND_READY_UP", "event")
        self.await_confirmations()

    def await_confirmations(self):
        players_ready = []
        while len(players_ready) < self.no_of_players:
            for message in self.socket.inbuffer:
                if message.content_type == "data-player-ready":
                    players_ready.append(message.origin)
                    self.socket.inbuffer.remove(message)
            time.sleep(0.2)
        return players_ready

    def request_theme_choices(self, theme_list):
        self.socket.send_to_all(theme_list, "data-theme-list")
        self.socket.send_to_all("CHOOSE_THEME", "event")

    def get_theme_choices(self, theme_list):
        self.request_theme_choices(theme_list)
        result = []

        self.is_timeout = False
        while (len(result) < self.no_of_players) and not self.is_timeout:
            for message in self.socket.inbuffer:
                if message.content_type == "data-theme-choice":
                    result.append(message.data)
                    self.socket.inbuffer.remove(message)
            time.sleep(0.2)
        if not result:
            return random.sample(theme_list, 3)
        else:
            return self.decide_themes(result, 3)

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
