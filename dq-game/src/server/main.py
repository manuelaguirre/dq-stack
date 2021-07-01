import os
import sys
import time
from threading import Thread

from utils.api_handler import APIHandler
from utils.socket_connection import ServerSocketConnection
import config.config as config

from controller import Controller
from coordinator import Coordinator
from game import DQGame
from server_renderer import ServerRenderer

socket = ServerSocketConnection(8000)
api_handler = APIHandler()
controller = Controller(socket)
dq_game = DQGame()

renderer = ServerRenderer()
coordinator = Coordinator(controller, renderer, dq_game, api_handler)


def start_game():
    coordinator.start()


game_thread = Thread(target=start_game)
game_thread.daemon = True
game_thread.start()
renderer.initialize()
