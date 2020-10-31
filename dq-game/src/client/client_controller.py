import sys
import os
from utils.socket_connection import ServerSocketConnection
from events.event_handler import EventHandler

class ClientController(EventHandler):
  def __init__(self, socket, renderer):
    """
    Creates a controller
    """
    self.socket = socket
    self.renderer = renderer
    self.socket.on('game_ready_to_start', self.start_game)

  def start_game(self):
    self.trigger('controller_start_game')

  def get_client_theme_choices(self):
    # Send instruction to choose themes to clients
    print('client controller get client theme choices')
    return False
