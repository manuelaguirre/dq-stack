import os
import pickle
import random
import sys
import time

import config.config as config
from events.event_handler import EventHandler
from utils.socket_connection import ServerSocketConnection
from game_types.player_answer import PlayerAnswer


class Controller(EventHandler):
    def __init__(self, socket):
        """
        Creates a controller
        """
        self.socket = socket
        self.no_of_players = None
        self.is_timeout = False
        self.current_answers = []
        self.current_played_jokers = {}

    def emit_timeout(self):
        self.is_timeout = True
        self.socket.send_to_all("TIMEOUT", "event")

    def timeout(self):
        self.is_timeout = True

    def await_connections(self):
        self.socket.listen(self.no_of_players)

    def set_number_of_players(self, number):
        self.no_of_players = number

    def distribute_usernames(self, players):
        for index, client in enumerate(self.socket.clients.values()):
            client["name"] = players[index].name
            self.socket.send(client["socket_object"], client["name"], "data-username")
        self.socket.send_to_all("SET_USERNAME", "event")

    def send_player_name_list(self, players):
        self.socket.send_to_all(
            [player.name for player in players], "data-player-name-list"
        )
        self.socket.send_to_all("SET_PLAYER_NAME_LIST", "event")

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

    def handle_blocked_players(self, players):
        for player in players:
            for joker_sender, joker in self.current_played_jokers.items():
                if joker["value"] == "BLOCK" and joker["target"] == player.name:
                    player.block_by(joker_sender)

    def clear_current_answers(self):
        self.current_answers = []

    def ask_question(self, question, players, answer_limit):

        blocked_players_for_wrong_answers = [
            player for player in players if player.blocked_for_wrong_answer
        ]

        blocked_players_by_other_players = [
            player for player in players if player.blocked_by
        ]

        for blocked_player in blocked_players_by_other_players:
            self.socket.send_to_socket_named(
                blocked_player.name, blocked_player.blocked_by, "data-blocking-player"
            )
            self.socket.send_to_socket_named(blocked_player.name, "BLOCKED", "event")

        self.socket.send_to_all(
            "ANSWER_QUESTION",
            "event",
            excepted_client_names=blocked_players_for_wrong_answers,
        )

        self.is_timeout = False

        while not self.is_timeout and len(self.current_answers) < answer_limit:
            for message in self.socket.inbuffer:
                if message.content_type == "data-answer":
                    self.process_answer(message)
                    self.socket.inbuffer.remove(message)

                    if len(self.current_answers) >= answer_limit:
                        self.current_answers = self.current_answers[:answer_limit]
                        self.flush_inbuffer()
                        break

            time.sleep(0.02)

    def flush_inbuffer(self):
        for message in self.socket.inbuffer:
            if message.content_type == "data-answer":
                self.socket.inbuffer.remove(message)

    def answer_limit_reached(self, player_names):
        try:
            for player_name in player_names:
                self.socket.send_to_socket_named(
                    player_name, "ANSWER_LIMIT_REACHED", "event"
                )
        except TypeError:
            pass

    def get_answerless_players(self, player_names):
        result = []
        for answer in self.current_answers:
            if answer.player_name not in player_names:
                result.append(answer.player_name)
        return result

    def process_answer(self, message):
        name = self.socket.clients[message.origin]["name"]
        answer = message.data
        player_answer = PlayerAnswer(name, answer)
        self.current_answers.append(player_answer)

    def resolve_question(self):
        self.is_timeout = True
        self.socket.send_to_all("RESOLVE_QUESTION", "event")

    def show_player_answer_is_wrong(self, player_name):
        self.socket.send_to_socket_named(player_name, "ANSWER_IS_WRONG", "event")

    def show_scores(self, score_board):
        self.socket.send_to_all(score_board, "data-score-board")
        self.socket.send_to_all("SHOW_SCORES", "event")
