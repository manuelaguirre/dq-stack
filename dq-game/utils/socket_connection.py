import sys
import os
import importlib.util
import socket
import time
import pickle
import threading
from collections import deque
# from game_types.question import DQQuestion

class SocketConnection:
  callbacks = {}
  def __init__(self, port):
    print('pijita')
    self.port = port
    self.tcpsock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    self.HEADER_LENGTH = 10

  def attach_header(self, msg):
    """
    Attaches a fixed length header for a TCP Websocket Transmission
    """
    return (f"{len(msg):<{self.HEADER_LENGTH}}"+msg)
    

class ClientSocketConnection(SocketConnection):
  def __init__(self, port):
    super().__init__(port)
    self.tcpsock.setblocking(1)
    self.client_id = 0
  
  def inbound_task(self):
    """
    Listen to inbound messages. 
    """
    while True:
      inbound_msg_length = int(self.tcpsock.recv(self.HEADER_LENGTH).strip())
      inbound_msg = self.tcpsock.recv(inbound_msg_length).decode('utf-8')
      print(inbound_msg)

  def send_to_server(self, msg):
    """
    Sends a message to the server
    """
    self.tcpsock.send(self.attach_header(msg).encode('utf-8'))

  def connect(self):
    while True:
      try:
        self.tcpsock.connect((socket.gethostname(), self.port))
        print('Connection success')
        msg = self.tcpsock.recv(1024)
        print(msg.decode('utf-8'))
        break
      except Exception as e:
        print(e)
        time.sleep(1)

    inbound_thread = threading.Thread(target=self.inbound_task)
    inbound_thread.start()

class ServerSocketConnection(SocketConnection):
  callbacks = {}

  def __init__(self, port):
    super().__init__(port)
    self.tcpsock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    self.tcpsock.bind((socket.gethostname(), self.port))
    self.clients = []
  
  def listen(self, expected_connections):
    self.tcpsock.listen(5)
    print('Server listening for connections')
    
    while (len(self.clients) < expected_connections):
      self.handle_requests()       
  
    print('now we are ready to start the game')
    print(self.clients)
    self.trigger('game_ready_to_start')

  def handle_requests(self):
    clientsocket, address = self.tcpsock.accept()
    clientsocket.send('Welcome to the game'.encode('utf-8'))

    new_client = {}
    new_client["clientsocket"] = clientsocket
    new_client["address"] = address
    buffer_size = int(clientsocket.recv(self.HEADER_LENGTH).strip())
    username = clientsocket.recv(buffer_size).decode('utf-8') 
    new_client["username"] = username
    self.clients.append(new_client)

    clientsocket.send(('' + str(len(self.clients))).encode('utf-8'))

  def send_question(self, question):
    pass
  
  def on(self, event_name, callback):
    # Add callback to the list of event_name callback list
    print('Add: ', event_name)
    if event_name not in self.callbacks:
      self.callbacks[event_name] = [callback]
    else:
      self.callbacks[event_name].append(callback)

  def trigger(self, event_name):
    if event_name in self.callbacks:
      for callback in self.callbacks[event_name]:
        callback()
          