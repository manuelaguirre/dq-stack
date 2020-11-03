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
        self.socket.on("game_ready_to_start", self.start)
        self.no_of_players = no_of_players
        self.players = []

    def start(self):
        self.trigger("start_game")

    def request_theme_choices(self, theme_list):

        self.socket.send_to_all(theme_list, "data-theme-list")
        self.socket.send_to_all("CHOOSE THEME", "event")
        self.trigger("THEMES REQUESTED")

    def get_theme_choices(self):
        result = []
        for message in self.socket.inbuffer:
            if message.content_type == "THEME CHOICE":
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
        for theme in count_dict.keys():
            idx = 0
            if len(result) == 0:
                result.append(theme)
            else:
                while idx < len(result) and count_dict[theme] < count_dict[result[idx]]:
                    idx += 1
                result.insert(idx, theme)
        return result[0:3]

    def await_connections(self):
        self.socket.listen(self.no_of_players)
        self.players = self.socket.clients.keys()


# class ClientController(EventHandler):
#     def __init__(self, socket):
#         """
#         Creates a controller
#         """
#         self.socket = socket
#         self.socket.listen(no_of_players)
#         self.socket.on("game_ready_to_start", self.trigger("start_game"))
#         self.players = self.socket.clients.keys()

#     def start(self):
#         self.trigger("start_game")

#     def request_theme_choices(self, theme_list):

#         self.socket.send_to_all("CHOOSE THEME", "event")
#         self.socket.send_to_all(pickle.dumps(theme_list), "data-pickle")
#         self.trigger("THEMES REQUESTED")

#     def get_theme_choices(self):
#         result = []
#         for message in self.socket.inbuffer:
#             if message.content_type == "THEME":
#                 result.append(message.data)

#         return result

#     def await_connections(self):
#         self.socket.listen(self.no_of_players)
#         self.players = self.socket.clients.keys()


# class ClientController(EventHandler):
#     def __init__(self, socket):
#         """
#         Creates a controller
#         """
#         self.socket = socket
#         self.socket.listen(no_of_players)
#         self.socket.on("game_ready_to_start", self.trigger("start_game"))
#         self.players = self.socket.clients.keys()
