import os
import sys
import pytest
from mock import patch, Mock
from server.controller import Controller
from utils.message import Message
import utils.socket_connection

@patch('utils.socket_connection.ServerSocketConnection')
def test_my_method_shouldCallMyClassMethodMyMethod_whenSomeOtherClassMethodIsCalled(self, mock_my_class):
    some_other_class =  SomeOtherClassThatUsesMyClass()
    some_other_class.method_under_test()
    self.assertTrue(mock_my_class.called)

class MockSocket:

    inb = [
        Message("Pedro", "theme-choice", "ThemePedro"),
        Message("Pablo", "themes-choice", "ThemePablo"),
        Message("Palito", "themes-choice", "ThemePalito")
    ]

NO_OF_PLAYERS = 3    
controller = Controller(3)
mock_socket = MockSocket()

class TestGetThemeChoices:

    def test_get_theme_choices(self, monkeypatch):
        
        monkeypatch.setattr(ServerSocketConnection, "inb", mock_socket.inb)

        #theme_list =  controller.get_theme_choices()

        expected = ["ThemePedro", "ThemePablo", "ThemePalito"]

        diff = set(theme_list) ^ set(expected)
       
        assert not diff