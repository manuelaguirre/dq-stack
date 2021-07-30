import argparse
import multiprocessing
import multiprocessing as mp
import os
import sys
from multiprocessing import Manager
from multiprocessing.managers import BaseManager

from utils.socket_connection import ClientSocketConnection

from client_controller import ClientController
from client_renderer import ClientRenderer
from event_coordinator import EventCoordinator
from front_renderer import FrontRenderer


def start_game(host_ip, port):

    # Create main classes
    client_renderer = ClientRenderer()
    front_renderer = None
    client_socket = ClientSocketConnection(host_ip, port)
    controller = ClientController(client_socket)
    coordinator = EventCoordinator(controller, client_renderer)

    def send_to_front_renderer(instruction, arg):
        front_renderer.receive_instruction(instruction, arg)

    # Bind events
    client_socket.on("TIMEOUT", coordinator.on_timeout)
    client_socket.on("ANSWER_LIMIT_REACHED", coordinator.on_answer_limit_reached)
    client_socket.on("BLOCKED", coordinator.on_blocked)

    client_socket.on("SET_USERNAME", coordinator.on_set_username)
    client_socket.on("SET_PLAYER_NAME_LIST", coordinator.on_set_player_name_list)
    client_socket.on(
        "SHOW_INSTRUCTIONS_AND_READY_UP", coordinator.on_show_name_and_instructions
    )
    client_socket.on("CHOOSE_THEME", coordinator.on_choose_theme)
    client_socket.on("START_ROUND", coordinator.on_start_round)
    client_socket.on(
        "SHOW_UPCOMING_QUESTION_THEME", coordinator.on_show_upcoming_question_theme
    )
    client_socket.on("START_LOTTERY", coordinator.on_start_joker_lottery)
    client_socket.on("ANSWER_QUESTION", coordinator.on_answer_question)
    client_socket.on("RESOLVE_QUESTION", coordinator.on_resolve_question)
    client_socket.on("ANSWER_IS_WRONG", coordinator.on_answer_is_wrong)
    client_socket.on("SHOW_SCORES", coordinator.on_show_scores)

    # Start
    def connect():
        client_socket.connect()

    client_renderer.on("RENDERER_INIT_DONE", connect)


    def front_renderer_thread():
        front_renderer = FrontRenderer()
        front_renderer.initialize()

    BaseManager.register("send_to_front_renderer", send_to_front_renderer)
    manager = BaseManager()
    manager.start()

    coordinator.send_to_front_renderer = manager.send_to_front_renderer

    thread_2 = multiprocessing.Process(target=front_renderer_thread)

    thread_2.start()

    client_renderer.initialize()


parser = argparse.ArgumentParser()
parser.add_argument("-p", "--port", type=int)
parser.add_argument("-H", "--host", type=str)
args = parser.parse_args()

if __name__ == '__main__':
    start_game(args.host, args.port)
