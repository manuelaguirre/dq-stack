import os
import sys

from utils.api_handler import APIHandler
from utils.socket_connection import ServerSocketConnection
from controller import Controller

from game import DQGame
from server_renderer import ServerRenderer

NO_OF_PLAYERS = 1

socket = ServerSocketConnection(8000)
api_handler = APIHandler()
controller = Controller(socket, NO_OF_PLAYERS)


def start_game():
    # Create main classes
    dq_game = DQGame()
    renderer = ServerRenderer()
    # Bind events
    renderer.on("start_game", dq_game.start)
    renderer.on("start_game", controller.request_theme_choices(["Matematica"]))
    dq_game.on("show_instructions", renderer.show_instructions)
    # dq_game.on("please choose themes", controller.get_theme_choices())
    # Start
    renderer.initialize()


controller.on("start_game", start_game)
controller.await_connections()
