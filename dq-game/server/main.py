import sys
import os
from utils.socket_connection import ServerSocketConnection
from utils.api_handler import APIHandler
from renderer import ServerRenderer
from game import DQGame

api_handler = APIHandler()
socket = ServerSocketConnection(8000)

def start_game():
  dq_game = DQGame()
  renderer = ServerRenderer()

  dq_game.on('show_instructions', renderer.showInstructions)
  dq_game.start()


socket.on('game_ready_to_start', start_game)
socket.listen()
