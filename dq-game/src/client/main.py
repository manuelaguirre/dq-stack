import sys
import os
from utils.socket_connection import ClientSocketConnection
from client_game import DQClientGame
from client_renderer import ClientRenderer
from client_controller import ClientController


def start_game():
    username = input("username > ")

    # Create main classes
    client_renderer = ClientRenderer()
    dq_client_game = DQClientGame()
    client_socket = ClientSocketConnection(8000)
    controller = ClientController(client_socket, client_renderer)

    # Bind events
    client_renderer.on("renderer_start_game", dq_client_game.start)
    client_socket.on("choose_themes", controller.get_client_theme_choices)

    # Start
    client_socket.connect()
    client_socket.send(username, "username")
    client_renderer.initialize()


start_game()
