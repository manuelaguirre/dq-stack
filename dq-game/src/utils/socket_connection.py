import importlib.util
import os
import pickle
import select
import socket
import sys
import threading
import time

from events.event_handler import EventHandler

from utils.message import Message

# from game_types.question import DQQuestion


class SocketConnection(EventHandler):
    # TODO: compose event handler
    def __init__(self, port, socket=socket.socket(socket.AF_INET, socket.SOCK_STREAM)):
        print("pijita")
        self.port = port
        self.tcpsock = socket
        self.HEADER_LENGTH = 10
        self.inbuffer = []

    def encode(self, msg):
        """
        Encodes a message for application layer transmission
        """
        msg = pickle.dumps(msg)
        return bytes(f"{len(msg):<{self.HEADER_LENGTH}}", "utf-8") + msg

    def send(self, destination_socket, data, content_type):
        """
        Sends a message to the socket.
        """
        msg = Message(self.tcpsock.getsockname(), data, content_type)
        destination_socket.sendall(self.encode(msg))

    def decode(self, inbound_msg):
        return pickle.loads(inbound_msg)

    def receive(self, socket):  # TODO: Crashes when putting chars like é
        """
        Receives bytes from socket and returns a tuple with the content type and the message
        """
        try:
            inbound_msg_length = int(socket.recv(self.HEADER_LENGTH).decode("utf-8"))
            return self.decode(socket.recv(inbound_msg_length))
        except ValueError:
            return False


class ClientSocketConnection(SocketConnection):
    def __init__(self, port):  # TODO: socket_service, socket
        super().__init__(port)
        self.tcpsock.setblocking(1)
        self.client_id = 0

    def send(self, msg, content_type):
        super().send(self.tcpsock, msg, content_type)

    def handle_incoming_message(self, inbound_msg):
        """
        Handles incoming messages
        """
        print(inbound_msg.data, inbound_msg.content_type)
        if inbound_msg.content_type == "event":
            self.trigger(inbound_msg.data)
        else:
            self.inbuffer.append(inbound_msg)
            print(self.inbuffer)

    def inbound_task(self):
        """
        Listen to inbound messages.
        """
        while True:
            inbound_msg = self.receive(self.tcpsock)
            print(inbound_msg.data)
            self.handle_incoming_message(inbound_msg)

    def connect(self):
        while True:
            try:
                self.tcpsock.connect((socket.gethostname(), self.port))
                print("Connection success")
                msg = self.tcpsock.recv(1024)
                print(msg.decode("utf-8"))
                break
            except Exception as e:
                print(e)
                time.sleep(1)

        inbound_thread = threading.Thread(target=self.inbound_task)
        inbound_thread.start()


class ServerSocketConnection(SocketConnection):
    def __init__(self, port):
        super().__init__(port)
        self.tcpsock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.tcpsock.bind((socket.gethostname(), self.port))

        self.clients = {}

    def listen(self, expected_connections):
        self.tcpsock.listen(5)
        print("Server listening for connections")

        while len(self.clients) < expected_connections:
            self.handle_requests()

        print("now we are ready to start the game")
        print(self.clients)
        inbound_thread = threading.Thread(
            target=self.inbound_task, args=(self.clients,)
        )
        inbound_thread.start()
        self.trigger("GAME_READY_TO_START")

    def handle_requests(self):
        clientsocket, address = self.tcpsock.accept()
        clientsocket.send("Welcome to the game".encode("utf-8"))

        new_client = {}
        new_client["clientsocket"] = clientsocket
        new_client["address"] = address
        msg = self.receive(clientsocket)
        new_client["client_name"] = msg.data
        self.clients[clientsocket] = new_client
        self.send(clientsocket, str(len(self.clients)), "handshake")

    def handle_message(self, message):
        """
        Message Handler
        """
        self.inbuffer.append(message)

    def send_to_all(self, msg, content_type):
        for client in self.clients:
            self.send(client, msg, content_type)

    def inbound_task(self, clients):
        """
        Inbound task for the server, accepting established connections as parameters
        """
        sockets_list = []
        for client in self.clients.keys():
            sockets_list.append(client)

        while True:
            read_sockets, _, exception_sockets = select.select(
                sockets_list, [], sockets_list
            )
            for notified_socket in read_sockets:
                message = self.receive(notified_socket)
                self.handle_message(message)
                if message is False:

                    print(
                        "Closed connection from: {}".format(
                            clients[notified_socket]["data"].decode("utf-8")
                        )
                    )

                    sockets_list.remove(notified_socket)

                    del clients[notified_socket]

                    continue

                    # Get user by notified socket, so we will know who sent the message
                notified_client = clients[notified_socket]

                print(
                    f'Received message from {notified_client["client_name"]}: {message.data}'
                )
