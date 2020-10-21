import sys
import os
from utils.socket_connection import ServerSocketConnection

class Controller:
    def __init__(self, no_of_players):
        """
        Creates a controller
        """
        self.socket = ServerSocketConnection(8000)
        self.socket.listen(no_of_players)
        self.players = socket.clients.keys()
    
    def get_theme_choices(self):
        return False


        