import sys
import os
from utils.socket_connection import ServerSocketConnection
from utils.api_handler import APIHandler

api_handler = APIHandler()
print(api_handler)
result = api_handler.get_questions(5)
result = (result.json())
print(result)

socket = ServerSocketConnection(8000)
socket.listen()
