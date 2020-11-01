import os
import sys

from utils.api_handler import APIHandler
from utils.socket_connection import ServerSocketConnection
from controller import Controller

from game import DQGame
from server_renderer import ServerRenderer

api_handler = APIHandler()
controller = Controller(1)


def start_game():
    # Create main classes
    dq_game = DQGame()
    renderer = ServerRenderer()
    # Bind events
    renderer.on("renderer_start_game", dq_game.start)
    dq_game.on("show_instructions", renderer.show_instructions)
    dq_game.on("choose_themes", controller.get_theme_choices)
    # Start
    renderer.initialize()


controller.on("controller_start_game", start_game)
controller.listen()
