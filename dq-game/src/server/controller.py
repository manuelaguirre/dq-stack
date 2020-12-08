import os
import pickle
import random
import sys
import time

from events.event_handler import EventHandler
from utils.socket_connection import ServerSocketConnection
from game_types.player_answer import PlayerAnswer


class Controller(EventHandler):
    def __init__(self, socket, no_of_players):
        """
        Creates a controller
        """
        self.socket = socket
        self.no_of_players = no_of_players
        self.player_names = []
        self.is_timeout = False
        self.current_answers = []
        self.current_played_jokers = {}

    def timeout(self):
        self.is_timeout = True
        self.socket.send_to_all("TIMEOUT", "event")

    def await_connections(self):
        self.socket.listen(self.no_of_players)
        for client in self.socket.clients:
            self.player_names.append(self.socket.clients[client]["name"])

    def send_instructions_and_await_confirmations(self, instructions):
        self.socket.send_to_all(instructions, "data-instructions")
        self.socket.send_to_all("SHOW_INSTRUCTIONS_AND_READY_UP", "event")
        self.await_confirmations()

    def await_confirmations(self):
        players_ready = []
        while len(players_ready) < self.no_of_players:
            for message in self.socket.inbuffer:
                if message.content_type == "data-player-ready":
                    players_ready.append(message.origin)
                    self.socket.inbuffer.remove(message)
            time.sleep(0.2)
        return players_ready

    def request_theme_choices(self, theme_list):
        self.socket.send_to_all(theme_list, "data-theme-list")
        self.socket.send_to_all("CHOOSE_THEME", "event")

    def get_theme_choices(self, theme_list):
        self.request_theme_choices(theme_list)
        result = []

        self.is_timeout = False
        while (len(result) < self.no_of_players) and not self.is_timeout:
            for message in self.socket.inbuffer:
                if message.content_type == "data-theme-choice":
                    result.append(message.data)
                    self.socket.inbuffer.remove(message)
            time.sleep(0.2)
        if not result:
            return random.sample(theme_list, 3)
        else:
            return self.decide_themes(result, 3)

    def decide_themes(self, theme_choices, result_size):
        count_dict = {}
        result = []
        for theme_choice in theme_choices:
            for theme in theme_choice:
                if theme not in count_dict:
                    count_dict[theme] = 1
                else:
                    count_dict[theme] += 1
        idx = 0
        while idx < result_size:
            idx += 1
            most_repeated_value = max(count_dict, key=count_dict.get)
            result.append(most_repeated_value)
            del count_dict[most_repeated_value]
        return result

    def start_round(self, round_number):
        self.socket.send_to_all(round_number, "data-round-number")
        self.socket.send_to_all("START_ROUND", "event")

    def send_upcoming_question_with_jokers(self, question, players):
        self.socket.send_to_all(question, "data-question")
        for client in self.socket.clients.values():
            for player in players:
                if client["name"] == player.name:
                    self.socket.send(
                        client["socket_object"], player.jokers, "data-jokers"
                    )

    def show_upcoming_question_theme(self):
        # TODO: CHANGE NAME!! !! !!!! !!!
        self.current_played_jokers = {}

        self.socket.send_to_all("SHOW_UPCOMING_QUESTION_THEME", "event")

        self.is_timeout = False
        while not self.is_timeout:
            for message in self.socket.inbuffer:
                if message.content_type == "data-joker":
                    self.process_joker(message)
                    self.socket.inbuffer.remove(message)

    def process_joker(self, message):
        client_name = self.socket.clients[message.origin]["name"]
        self.current_played_jokers[client_name] = message.data

    def ask_question(self, question):
        # TODO: JOKERS
        self.current_answers = []

        self.socket.send_to_all("ANSWER_QUESTION", "event")

        self.is_timeout = False

        while not self.is_timeout:
            for message in self.socket.inbuffer:
                if message.content_type == "data-answer":
                    self.process_answer(message)
                    self.socket.inbuffer.remove(message)
            time.sleep(0.2)

    def process_answer(self, message):
        name = self.socket.clients[message.origin]["name"]
        answer = message.data
        player_answer = PlayerAnswer(name, answer)
        self.current_answers.append(player_answer)

    def resolve_question(self):
        self.is_timeout = True
        self.socket.send_to_all("RESOLVE_QUESTION", "event")

    def show_scores(self, score_board):
        self.socket.send_to_all(score_board, "data-score-board")
        self.socket.send_to_all("SHOW_SCORES", "event")
