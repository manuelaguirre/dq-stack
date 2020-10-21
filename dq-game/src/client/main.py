import sys
import os
from utils.socket_connection import ClientSocketConnection


username = input("username > ")

socket = ClientSocketConnection(8000)
socket.connect()
socket.send(username, "username")



