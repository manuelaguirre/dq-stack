import os
import sys
import argparse

from utils.socket_connection import ClientSocketConnection

# from client_controller import ClientController
from front_renderer import FrontRenderer
from front_controller import FrontController
from front_event_coordinator import FrontEventCoordinator


def start_game(host_ip, port):

    # Create main classes
    front_renderer = FrontRenderer()
    client_socket = FrontSocketConnection(host_ip, port)  # TODO
    controller = FrontController(client_socket)
    coordinator = FrontEventCoordinator(controller, front_renderer)

    # Bind events
    client_socket.on("TIMEOUT", coordinator.on_timeout)
    client_socket.on("SHOW_BLOCKED", coordinator.on_blocked)

    client_socket.on("SET_USERNAME", coordinator.on_set_username)
    client_socket.on("SHOW_INSTRUCTIONS_AND_READY_UP", front_renderer.show_username)
    client_socket.on("CHOOSE_THEME", front_renderer.show_username)
    client_socket.on("START_ROUND", front_renderer.show_username)
    client_socket.on(
        "SHOW_UPCOMING_QUESTION_THEME", coordinator.on_show_upcoming_question_theme
    )
    client_socket.on("START_LOTTERY", front_renderer.show_username)
    client_socket.on("ANSWER_QUESTION", front_renderer.show_username)
    client_socket.on("RESOLVE_QUESTION", coordinator.on_resolve_question)
    client_socket.on("SHOW_SCORES", coordinator.on_show_scores)

    # Start
    def connect():
        client_socket.connect()

    front_renderer.on("RENDERER_INIT_DONE", connect)
    front_renderer.initialize()


parser = argparse.ArgumentParser()
parser.add_argument("-p", "--port", type=int)
parser.add_argument("-H", "--host", type=str)
args = parser.parse_args()

start_game(args.host, args.port)
