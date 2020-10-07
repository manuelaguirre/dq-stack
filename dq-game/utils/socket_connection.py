import sys
import os
import importlib.util
import socket
import time
import pickle
from game_types.question import Question

class SocketConnection:
  def __init__(self, port):
    print('pijita')
    self.port = port
    self.tcpsock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

class ClientSocketConnection(SocketConnection):
  def __init__(self, port):
    super().__init__(port)
    self.tcpsock.setblocking(1)
    self.client_id = 0
  
  def connect(self):
    while True:
      try:
        self.tcpsock.connect((socket.gethostname(), self.port))
        print('Connection success')
        msg = self.tcpsock.recv(1024)
        print(msg.decode('utf-8'))
        self.client_id = self.tcpsock.recv(1024).decode('utf-8')
        print('My client id is:', self.client_id)
        self.tcpsock.send(('Thanks for receiving me, sincerely: client number ' + self.client_id).encode('utf-8'))
        msg = self.tcpsock.recv(1024)

        question = pickle.loads(msg)
        print(question)
        break
      except:
        print('Erreur serveur')
        time.sleep(1)
    print('While breaked')


class ServerSocketConnection(SocketConnection):
  def __init__(self, port):
    super().__init__(port)
    self.tcpsock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    self.tcpsock.bind((socket.gethostname(), self.port))
    self.clients = 0
  
  def listen(self):
    self.tcpsock.listen(10)
    print('Server listening for connections')
    while True:
      clientsocket, address = self.tcpsock.accept()
      if (clientsocket and address):
        print('Connection received: ', clientsocket, address)
        clientsocket.send('Welcome to the game'.encode('utf-8'))
        self.clients += 1
        clientsocket.send(('' + str(self.clients)).encode('utf-8'))
        msg = clientsocket.recv(1024)
        print(msg.decode('utf-8'))
        question = Question("Quién es Dios", ["Maradona", "Allah", "Yahve", "Christus"], 0, )
        msg = pickle.dumps(question)
        clientsocket.send(msg)

  def send_question(self, question):
    pass
          