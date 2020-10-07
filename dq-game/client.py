import sys
import os
from utils.socket_connection import ClientSocketConnection

socket = ClientSocketConnection(8000)
socket.connect()

