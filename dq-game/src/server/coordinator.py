import sys
import os
import time


class Coordinator:
    def __init__(self, controller, renderer, dq_game, api_handler, players_id):
        self.controller = controller
        self.renderer = renderer
        self.dq_game = dq_game
        self.api_handler = api_handler
        self.players_id = players_id

    def start(self):
        self.game_setup()
        self.game_preparation()
        self.theme_selection_round()

    def game_setup(self):
        self.dq_game.set_available_themes(self.api_handler.get_available_themes())
        self.controller.await_connections()

    def game_preparation(self):
        self.renderer.show_instructions(self.dq_game.instructions)
        self.controller.send_instructions_and_await_confirmations(
            self.dq_game.instructions
        )

    def theme_selection_round(self):
        self.renderer.show_available_themes(self.dq_game.get_available_theme_names())
        self.renderer.show_timer(10, self.controller.timeout)
        chosen_themes = self.controller.get_theme_choices(self.dq_game.get_available_theme_names())
        self.dq_game.set_chosen_themes(chosen_themes)
        self.renderer.show_chosen_themes(chosen_themes)
        questions = self.api_handler.get_questions(chosen_themes, self.players_id)
        self.dq_game.set_game_questions(questions)
