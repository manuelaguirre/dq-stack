import sys
import os
from utils.socket_connection import ServerSocketConnection

socket = ServerSocketConnection(8000)
socket.listen()