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

# TODO: Separate client and server socket connections in dif files
class SocketConnection(EventHandler):
    def __init__(self, port, socket=socket.socket(socket.AF_INET, socket.SOCK_STREAM)):
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

    def receive(self, socket):
        """
        Receives bytes from socket and returns a tuple with the content type and the message
        """
        try:
            inbound_msg_length = int(socket.recv(self.HEADER_LENGTH).decode("utf-8"))
            message = self.decode(socket.recv(inbound_msg_length))
            print(message.origin)
            return message
        except ValueError:
            return False


class ClientSocketConnection(SocketConnection):
    def __init__(self, port):
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

    def inbound_task(self):
        """
        Listen to inbound messages.
        """
        while True:
            inbound_msg = self.receive(self.tcpsock)
            self.handle_incoming_message(inbound_msg)

    def connect(self):
        while True:
            try:
                self.tcpsock.connect((socket.gethostname(), self.port))
                print("Connection success")
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

        # Map (address) => client (address, name)
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
        socket_object, address = self.tcpsock.accept()

        new_client = {}
        new_client["socket_object"] = socket_object
        new_client["address"] = address
        new_client["name"] = None
        self.clients[address] = new_client
        self.send(socket_object, str(len(self.clients)), "handshake")

    def handle_message(self, message):
        """
        Message Handler
        """
        self.inbuffer.append(message)

    def send_to_all(self, msg, content_type):
        for client in self.clients:
            self.send(self.clients[client]["socket_object"], msg, content_type)

    def inbound_task(self, clients):
        """
        Inbound task for the server, accepting established connections as parameters
        """
        sockets_list = []
        for client in clients.values():
            sockets_list.append(client["socket_object"])

        while True:
            read_sockets, _, exception_sockets = select.select(
                sockets_list, [], sockets_list
            )
            for notified_socket in read_sockets:
                # message: { origin: (), data: any, content_type: string }
                message = self.receive(notified_socket)
                self.handle_message(message)
                if message is False:

                    print(
                        f"Closed connection from: {clients[notified_socket.getpeername()]['name']}"
                    )

                    sockets_list.remove(notified_socket)

                    del clients[notified_socket]

                    continue

                    # Get user by notified socket, so we will know who sent the message
                notified_client = clients[notified_socket.getpeername()]

                print(
                    f'Received message from {notified_client["name"]}: {message.data}'
                )
