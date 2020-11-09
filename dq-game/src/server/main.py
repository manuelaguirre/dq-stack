import os
import sys
import time

from utils.api_handler import APIHandler
from utils.socket_connection import ServerSocketConnection

from controller import Controller
from game import DQGame
from server_renderer import ServerRenderer

NO_OF_PLAYERS = 2

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
    dq_game = DQGame(theme_list)
    renderer = ServerRenderer()
    # Bind events
    renderer.on("RENDERER_START_GAME", dq_game.show_instructions)
    dq_game.on("SHOW_INSTRUCTIONS", renderer.show_instructions)
    renderer.on("SHOW_INSTRUCTIONS_DONE", dq_game.start)
    dq_game.on("REQUEST_CHOOSE_THEMES", controller.request_theme_choices)
    time.sleep(3)
    controller.get_theme_choices()
    # Start
    renderer.initialize()


controller.on("START_GAME", start_game)
controller.await_connections()
