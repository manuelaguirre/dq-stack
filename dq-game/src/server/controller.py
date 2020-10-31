import sys
import os
from utils.socket_connection import ServerSocketConnection
from events.event_handler import EventHandler

class Controller(EventHandler):
  def __init__(self, no_of_players):
    """
    Creates a controller
    """
    self.no_of_players = no_of_players
    self.socket = ServerSocketConnection(8000)
    self.socket.on('game_ready_to_start', self.start_game)

  def listen(self):
    self.socket.listen(self.no_of_players)
    self.players = self.socket.clients.keys()

  def start_game(self):
    print('controller start game')
    self.trigger('controller_start_game')

  def get_theme_choices(self):
    # Send instruction to choose themes to clients
    return False
