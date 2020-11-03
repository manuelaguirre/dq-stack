import os
import sys
import pytest
from mock import patch, Mock, MagicMock

from server.controller import Controller
from utils.message import Message
from utils.socket_connection import ServerSocketConnection


NO_OF_PLAYERS = 5

# Patch Configs for external dependencies
pickle_config = {"spec": ["dumps"], "dumps.return_value": "Pickled Object"}


class MockSocket:
    def __init__(self):

        self.listen = MagicMock()
        self.on = MagicMock()
        self.send_to_all = MagicMock()

        self.socket_key1 = (
            MagicMock()
        )  #            <socket.socket fd=5, family=AddressFamily.AF_INET, type=SocketKind.SOCK_STREAM, proto=0, laddr=('127.0.1.1', 8000), raddr=('127.0.0.1', 44772)>: {
        self.socket_key2 = (
            MagicMock()
        )  #            <socket.socket fd=6, family=AddressFamily.AF_INET, type=SocketKind.SOCK_STREAM, proto=0, laddr=('127.0.1.1', 8000), raddr=('127.0.0.1', 44778)>:
        self.socket_key3 = (
            MagicMock()
        )  # <socket.socket fd=9, family=AddressFamily.AF_INET, type=SocketKind.SOCK_STREAM, proto=0, laddr=('127.0.1.1', 8000), raddr=('127.0.0.1', 57436)>
        self.socket_key4 = (
            MagicMock()
        )  # <socket.socket fd=8, family=AddressFamily.AF_INET, type=SocketKind.SOCK_STREAM, proto=0, laddr=('127.0.1.1', 8000), raddr=('127.0.0.1', 57434)>
        self.socket_key5 = (
            MagicMock()
        )  # <socket.socket fd=7, family=AddressFamily.AF_INET, type=SocketKind.SOCK_STREAM, proto=0, laddr=('127.0.1.1', 8000), raddr=('127.0.0.1', 57430)>

        self.clients = {
            self.socket_key1: {
                "clientsocket": self.socket_key1,
                "address": ("127.0.0.1", 44772),
                "client_name": "Pedro",
            },
            self.socket_key2: {
                "clientsocket": self.socket_key2,
                "address": ("127.0.0.1", 44778),
                "client_name": "Pablo",
            },
            self.socket_key3: {
                "clientsocket": self.socket_key3,
                "address": ("127.0.0.1", 57436),
                "client_name": "Ricardo",
            },
            self.socket_key4: {
                "clientsocket": self.socket_key4,
                "address": ("127.0.0.1", 57434),
                "client_name": "Marcos",
            },
            self.socket_key5: {
                "clientsocket": self.socket_key5,
                "address": ("127.0.0.1", 57430),
                "client_name": "Eduardo",
            },
        }


# class TestGetThemeChoices:
#     socket = MockSocket()

#     def test_get_theme_choices_returns_set_from_inbuffer_msgs(self):
#         """
#         Should return a set eliminating repeated elements
#         """

#         socket = MockSocket()

#         socket.inbuffer = [
#             Message(socket.socket_key1, "THEME CHOICE", "Matemática"),
#             Message(socket.socket_key3, "THEME CHOICE", "Historia"),
#             Message(socket.socket_key2, "THEME CHOICE", "Historia"),
#             Message(socket.socket_key4, "THEME CHOICE", "Sport"),
#             Message(socket.socket_key5, "THEME CHOICE", "Culture Génerale"),
#         ]

#         controller = Controller(socket, NO_OF_PLAYERS)
#         result = controller.get_theme_choices()

#         assert set(result) == {"Historia", "Matemática", "Sport", "Culture Génerale"}


class TestDecideThemeChoices:
    def test_should_give_the_best_rated_themes(self):
        """
        Gives the best results in order
        """
        socket = MockSocket()
        theme_choices = [
            ["1", "2", "5"],
            ["1", "4", "7"],
            ["1", "3", "2"],
            ["2", "3", "4"],
            ["1", "3", "5"],
            ["1", "2", "6"],
        ]

        controller = Controller(socket, NO_OF_PLAYERS)
        result = controller.decide_themes(theme_choices, result_size=3)

        assert result == ["1", "2", "3"]


class TestRequestThemeChoices:
    def test_should_call_connection_send_method(self):
        socket = MockSocket()
        socket.send_to_all = MagicMock()
        theme_list = ["This", "is", "the", "Theme", "List"]

        controller = Controller(socket, NO_OF_PLAYERS)
        controller.request_theme_choices(theme_list)

        socket.send_to_all.assert_any_call(theme_list, "data-theme-list")
        socket.send_to_all.assert_called_with("CHOOSE_THEME", "event")

    def test_should_trigger_wait_for_themes(self):
        socket = MockSocket()
        controller = Controller(socket, NO_OF_PLAYERS)
        controller.trigger = MagicMock()
        theme_list = MagicMock()

        controller.request_theme_choices(theme_list)

        controller.trigger.assert_called_once_with("THEMES_REQUESTED")
