import os
import sys

from utils.api_handler import APIHandler
from utils.socket_connection import ServerSocketConnection
from controller import Controller

from game import DQGame
from renderer import ServerRenderer

api_handler = APIHandler()

controller = Controller()


def start_game():
  players = socket.clients.keys()
  dq_game = DQGame(players)
  renderer = ServerRenderer()

  dq_game.on('start-game', renderer.showInstructions)
  dq_game.start()


socket.on('start-game', start_game)

socket.listen(2)

dq_game.on("please choose themes", controller.get_theme_choices())

