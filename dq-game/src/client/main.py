import os
import sys

from utils.socket_connection import ClientSocketConnection

from client_controller import ClientController
from client_game import DQClientGame
from client_renderer import ClientRenderer


def start_game():
    username = input("username > ")

    # Create main classes
    client_renderer = ClientRenderer()
    dq_client_game = DQClientGame()
    client_socket = ClientSocketConnection(8000)
    controller = ClientController(client_socket)

    # Bind events
    client_renderer.on("RENDERER_START_GAME", dq_client_game.start)
    client_socket.on("CHOOSE_THEME", controller.get_client_theme_choices)
    controller.on("SELECT_THEMES", client_renderer.select_themes)
    client_renderer.on("THEMES_CHOICE_DONE", controller.send_client_theme_choices)

    # Start
    client_socket.connect()
    client_socket.send(username, "username")
    # TODO: Change these to make user click on ready button
    controller.ready_up()
    client_renderer.initialize()


start_game()
