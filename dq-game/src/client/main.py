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
    client_socket.on("CONNECTED", coordinator.on_connected)
    # client_socket.on("CHOOSE_THEME", coordinator.on_choose_theme) TODO: tenés que usar esta línea y quitar la siguiente, toda la lógica hacerla en coordinator.on_choose_theme
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
