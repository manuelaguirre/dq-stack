import os
import sys
import time
from threading import Thread

from utils.api_handler import APIHandler
from utils.socket_connection import ServerSocketConnection

from controller import Controller
from coordinator import Coordinator
from game import DQGame
from server_renderer import ServerRenderer

NO_OF_PLAYERS = 2

socket = ServerSocketConnection(8000)
api_handler = APIHandler()
controller = Controller(socket, NO_OF_PLAYERS)

renderer = ServerRenderer()
coordinator = Coordinator(controller, renderer)


def start_game():
    coordinator.start()


game_thread = Thread(target=start_game)
game_thread.start()
renderer.initialize()
