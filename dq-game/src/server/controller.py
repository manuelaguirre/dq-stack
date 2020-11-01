import sys
import os
import pickle
from utils.socket_connection import ServerSocketConnection
from events.event_handler import EventHandler


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

        self.socket.send_to_all("CHOOSE THEME", "event")
        self.socket.send_to_all(pickle.dumps(theme_list), "data-pickle")
        self.trigger("THEMES REQUESTED")

    def get_theme_choices(self):
        result = []
        for message in self.socket.inbuffer:
            if message.content_type == "THEME":
                result.append(message.data)

        return result

    def await_connections(self):
        self.socket.listen(self.no_of_players)
        self.players = self.socket.clients.keys()


class ClientController(EventHandler):
    def __init__(self, socket):
        """
        Creates a controller
        """
        self.socket = socket
        self.socket.listen(no_of_players)
        self.socket.on("game_ready_to_start", self.trigger("start_game"))
        self.players = self.socket.clients.keys()

    def start(self):
        self.trigger("start_game")

    def request_theme_choices(self, theme_list):

        self.socket.send_to_all("CHOOSE THEME", "event")
        self.socket.send_to_all(pickle.dumps(theme_list), "data-pickle")
        self.trigger("THEMES REQUESTED")

    def get_theme_choices(self):
        result = []
        for message in self.socket.inbuffer:
            if message.content_type == "THEME":
                result.append(message.data)

        return result

    def await_connections(self):
        self.socket.listen(self.no_of_players)
        self.players = self.socket.clients.keys()


class ClientController(EventHandler):
    def __init__(self, socket):
        """
        Creates a controller
        """
        self.socket = socket
        self.socket.listen(no_of_players)
        self.socket.on("game_ready_to_start", self.trigger("start_game"))
        self.players = self.socket.clients.keys()
