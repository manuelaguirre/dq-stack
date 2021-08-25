import os
import sys

import time


class FrontEventCoordinator:
    def __init__(self, controller, renderer):
        self.controller = controller
        self.renderer = renderer
        self.current_round_number = 0
        self.current_question = None
        self.current_score_board = None
        self.jokers = []
        self.active_joker = None
        self.is_blocked = False

    def on_timeout(self):
        self.renderer.on_timeout()

    def on_set_username(self):
        self.renderer.username = self.controller.get_username()

    def on_show_upcoming_question_theme(self):
        theme = self.controller.get_theme()
        self.renderer.on_show_upcoming_question_theme(theme)

    def on_blocked(self):
        blocking_player = self.controller.get_blocking_player()
        self.renderer.show_block(blocking_player)

    def on_resolve_question(self):
        (
            player_answer,
            choice_letter,
            status,
        ) = self.controller.get_player_answer_and_status()
        self.renderer.show_answer(player_answer, choice_letter, status)

    def on_show_scores(self):
        differential, total_points = self.controller.get_points()
        self.renderer.show_scores(differential, total_points)
