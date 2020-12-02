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
    client_renderer.username = username
    client_socket = ClientSocketConnection(8000)
    controller = ClientController(client_socket)
    coordinator = EventCoordinator(controller, client_renderer)

    # Bind events
    client_socket.on("TIMEOUT", coordinator.on_timeout)
    client_socket.on("SHOW_INSTRUCTIONS_AND_READY_UP", coordinator.on_show_instructions)
    client_socket.on("CHOOSE_THEME", coordinator.on_choose_theme)
    client_socket.on("START_ROUND", coordinator.on_start_round)
    client_socket.on(
        "SHOW_UPCOMING_QUESTION_THEME", coordinator.on_show_upcoming_question_theme
    )
    client_socket.on("ANSWER_QUESTION", coordinator.on_answer_question)
    client_socket.on("RESOLVE_QUESTION", coordinator.on_resolve_question)
    client_socket.on("SHOW_SCORES", coordinator.on_show_scores)

    # Start
    def connect():
        client_socket.connect()
        client_socket.send(username, "username")
    
    client_renderer.on("RENDERER_INIT_DONE", connect)
    client_renderer.initialize()


start_game()
