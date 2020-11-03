import os
import sys
import time

from utils.api_handler import APIHandler
from utils.socket_connection import ServerSocketConnection

from controller import Controller
from game import DQGame
from server_renderer import ServerRenderer

NO_OF_PLAYERS = 1

socket = ServerSocketConnection(8000)
api_handler = APIHandler()
controller = Controller(socket, NO_OF_PLAYERS)

# MOCKS
theme_list = [
    "Historia",
    "Sport",
    "Matemática",
    "Cultura general",
    "Geografía",
    "Naturaleza",
    "Sociología",
]


def start_game():
    # Create main classes
    dq_game = DQGame()
    renderer = ServerRenderer()
    # Bind events
    renderer.on("START_GAME", dq_game.start)
    dq_game.on("SHOW_INSTRUCTIONS", renderer.show_instructions)
    controller.request_theme_choices(theme_list)
    time.sleep(3)
    controller.get_theme_choices()
    # Start
    renderer.initialize()


controller.on("START_GAME", start_game)
controller.await_connections()
