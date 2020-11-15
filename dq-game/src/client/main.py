import os
import sys

from utils.socket_connection import ClientSocketConnection

from client_controller import ClientController
from client_game import DQClientGame
from client_renderer import ClientRenderer
from event_coordinator import EventCoordinator


def start_game():
    username = input("username > ")

    # Create main classes
    client_renderer = ClientRenderer()
    client_socket = ClientSocketConnection(8000)
    controller = ClientController(client_socket)
    coordinator = EventCoordinator(controller, client_renderer)

    # Bind events
    client_socket.on("SHOW_INSTRUCTIONS", coordinator.on_show_instructions)
    client_socket.on("CHOOSE_THEME", coordinator.on_choose_theme)

    # Start
    client_socket.connect()
    client_socket.send(username, "username")
    client_renderer.initialize()


start_game()
