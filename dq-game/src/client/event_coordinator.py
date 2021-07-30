import os
import sys

import time

from client.pages.player_initial_page import PlayerInitialPage
from client.pages.joker_lottery_page import JokerLotteryPage


class EventCoordinator:
    def __init__(self, controller, renderer):
        self.controller = controller
        self.renderer = renderer
        self.current_round_number = 0
        self.current_question = None
        self.current_score_board = None
        self.jokers = []
        self.active_joker = None
        self.is_blocked = False

    def send_to_front_renderer(self, instruction):
        pass

    def on_timeout(self):
        self.renderer.screen_handler.clear_data()
        self.renderer.show_logo()

    def on_answer_limit_reached(self):
        self.renderer.show_answer_limit_message()

    def on_set_username(self):
        username = self.controller.get_username()
        self.renderer.username = username
        self.send_to_front_renderer("set_username", username)

    def on_set_player_name_list(self):
        self.renderer.player_name_list = self.controller.get_player_name_list()
        self.renderer.player_name_list.remove(self.renderer.username)

    def on_show_name_and_instructions(self):
        """
        Gets instructions from server.
        Sends them to the renderer with a ready callback function.
        """

        def show_instructions():
            instructions = self.controller.get_instructions()
            self.renderer.show_instructions_and_confirmation_button(
                instructions, self.controller.ready_up
            )

        page = PlayerInitialPage(self.renderer, self.renderer.screen_handler)
        page.set_data(self.renderer.username)
        page.set_callback(show_instructions)
        page.render()

    def on_choose_theme(self):
        themes = self.controller.get_theme_list()
        self.renderer.select_themes(themes, self.controller.send_client_theme_choices)

    def on_start_round(self):
        self.current_round_number = self.controller.get_round_number()
        self.renderer.show_round_instructions(self.current_round_number)

    def on_show_upcoming_question_theme(self):
        self.current_question = self.controller.get_current_question()

        self.active_joker = None
        self.is_blocked = False

        self.jokers = self.controller.get_jokers()

        self.renderer.show_upcoming_question_theme_and_jokers(
            self.current_question.theme, self.jokers, self._activate_joker_and_send
        )

    def _activate_joker_and_send(self, value, target=None):
        self.controller.send_joker(value, target=target)
        self.active_joker = value

    def on_answer_question(self):
        self.renderer.answer_question(
            self.current_question,
            self.active_joker,
            self.controller.send_answer
            if not self.is_blocked
            else self.renderer.show_is_blocked,
        )

    def on_blocked(self):
        self.is_blocked = True
        self.renderer.blocking_player = self.controller.get_blocking_player()

    def on_resolve_question(self):
        if not self.is_blocked:
            self.renderer.show_results(self.current_question)

    def on_answer_is_wrong(self):
        self.renderer.show_answer_is_wrong()

    def on_show_scores(self):
        self.current_score_board = self.controller.get_score_board()
        self.renderer.show_scores(self.current_score_board)

    def on_start_joker_lottery(self):
        def send_joker(value):
            self.controller.send_joker_lottery_result(value)

        page = JokerLotteryPage(self.renderer, self.renderer.screen_handler)
        page.set_callback(send_joker)
        page.render()
