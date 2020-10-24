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
  # Create main classes
  dq_game = DQGame()
  renderer = ServerRenderer()
  # Bind events
  renderer.on('start_game', dq_game.start)
  dq_game.on('show_instructions', renderer.show_instructions)
  # Start
  renderer.initialize()

socket.on('start-game', start_game)

socket.listen(2)

dq_game.on("please choose themes", controller.get_theme_choices())
