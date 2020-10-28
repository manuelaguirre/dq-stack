import os
import sys
import pytest
from mock import patch, Mock, MagicMock

from server.controller import Controller
from utils.message import Message
from utils.socket_connection import ServerSocketConnection

    
NO_OF_PLAYERS = 5

#Patch Configs for external dependencies
pickle_config = {
    "spec" : ["dumps"],
    "dumps.return_value" : "Pickled Object"
}

class MockSocket:
    
    def __init__(self):

        self.listen = MagicMock()
        self.on = MagicMock()
        self.send_to_all = MagicMock()

        self.socket_key1 = MagicMock() #            <socket.socket fd=5, family=AddressFamily.AF_INET, type=SocketKind.SOCK_STREAM, proto=0, laddr=('127.0.1.1', 8000), raddr=('127.0.0.1', 44772)>: {
        self.socket_key2 = MagicMock() #            <socket.socket fd=6, family=AddressFamily.AF_INET, type=SocketKind.SOCK_STREAM, proto=0, laddr=('127.0.1.1', 8000), raddr=('127.0.0.1', 44778)>: 
        self.socket_key3 = MagicMock() # <socket.socket fd=9, family=AddressFamily.AF_INET, type=SocketKind.SOCK_STREAM, proto=0, laddr=('127.0.1.1', 8000), raddr=('127.0.0.1', 57436)>
        self.socket_key4 = MagicMock() # <socket.socket fd=8, family=AddressFamily.AF_INET, type=SocketKind.SOCK_STREAM, proto=0, laddr=('127.0.1.1', 8000), raddr=('127.0.0.1', 57434)>
        self.socket_key5 = MagicMock() # <socket.socket fd=7, family=AddressFamily.AF_INET, type=SocketKind.SOCK_STREAM, proto=0, laddr=('127.0.1.1', 8000), raddr=('127.0.0.1', 57430)>



        self.clients = {
            self.socket_key1: {
                'clientsocket': self.socket_key1, 
                'address': ('127.0.0.1', 44772), 
                'client_name': "Pedro"
            },
            self.socket_key2: 
            {
                'clientsocket': self.socket_key2, 
                'address': ('127.0.0.1', 44778), 
                'client_name': "Pablo"
            },
            self.socket_key3: 
            {
                'clientsocket': self.socket_key3, 
                'address': ('127.0.0.1', 57436), 
                'client_name': "Ricardo"
            },
            self.socket_key4: 
            {
                'clientsocket': self.socket_key4, 
                'address': ('127.0.0.1', 57434), 
                'client_name': "Marcos"
            },
            self.socket_key5: 
            {
                'clientsocket': self.socket_key5, 
                'address': ('127.0.0.1', 57430), 
                'client_name': "Eduardo"
            }
        }

    

class TestGetThemeChoices:
    socket = MockSocket()

    def test_get_theme_choices_returns_set_from_inbuffer_msgs(self):
        """
        Should return a set eliminating repeated elements
        """
       
        socket = MockSocket()

        socket.inbuffer = [
            Message(socket.socket_key1, "THEME CHOICE", "Matemática"), 
            Message(socket.socket_key3, "THEME CHOICE", "Historia"),
            Message(socket.socket_key2, "THEME CHOICE", "Historia"),
            Message(socket.socket_key4, "THEME CHOICE", "Sport"),
            Message(socket.socket_key5, "THEME CHOICE", "Culture Génerale"),        
        ]

        controller = Controller(socket, NO_OF_PLAYERS)
        result = controller.get_theme_choices()

        assert set(result) == {"Historia", "Matemática", "Sport", "Culture Génerale"}

class TestRequestThemeChoices:

    @patch('server.controller.pickle', **pickle_config)
    def test_should_pickle_and_send_theme_list(self, mock_pickle):

        socket = MockSocket()
        theme_list = ["Historia", "Sport", "Matemática", "Geografía"]
        controller = Controller(socket, NO_OF_PLAYERS)

        controller.request_theme_choices(theme_list)

        mock_pickle.dumps.assert_called_with(theme_list)
        socket.send_to_all.assert_called_with("Pickled Object", "data")

    @patch('server.controller.pickle', **pickle_config)
    def test_should_call_connection_send_method(self, mock_pickle):
        socket = MockSocket()
        socket.send_to_all = MagicMock()
        theme_list = MagicMock()

        controller = Controller(socket, NO_OF_PLAYERS)
        controller.request_theme_choices(theme_list)

        socket.send_to_all.assert_any_call("CHOOSE THEME", "event")

    @patch('server.controller.pickle', **pickle_config)
    def test_should_trigger_wait_for_themes(self, mock_pickle):
        socket = MockSocket()
        controller = Controller(socket, NO_OF_PLAYERS)
        controller.trigger = MagicMock()
        theme_list = MagicMock()

        controller.request_theme_choices(theme_list)

        controller.trigger.assert_called_once_with("THEMES REQUESTED")

        
        