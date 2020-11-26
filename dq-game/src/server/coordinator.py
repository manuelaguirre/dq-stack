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
        self.first_round()

    def game_setup(self):
        question_pools = self.api_handler.get_question_pools(self.players_id)
        self.dq_game.set_game_question_pools(question_pools)
        self.controller.await_connections()

    def game_preparation(self):
        self.renderer.show_instructions(self.dq_game.instructions)
        self.controller.send_instructions_and_await_confirmations(
            self.dq_game.instructions
        )

    def theme_selection_round(self):
        available_themes = self.dq_game.get_available_theme_names()
        self.renderer.show_available_themes(available_themes)
        self.renderer.show_timer(10, self.controller.timeout)

        chosen_themes = self.controller.get_theme_choices(available_themes)
        self.dq_game.set_rounds(chosen_themes)
        self.renderer.show_chosen_themes(chosen_themes)
        time.sleep(5)

    def first_round(self):
        self.renderer.show_round_instructions(self.dq_game.rounds[0].number)
        self.controller.start_round(1)
        time.sleep(5)
        for index, question in enumerate(self.dq_game.rounds[0].questions):
            # Send upcoming question
            self.controller.send_upcoming_question(question)
            #  Show theme
            self.controller.show_upcoming_question_theme()
            self.renderer.show_upcoming_question_theme(question.theme)
            # Show question
            time.sleep(5)
            self.ask_question(question, index)
            time.sleep(5)

    def ask_question(self, question, index):
        def resolve_question():
            self.renderer.show_correct_answer(question, index)
            self.controller.resolve_question()

        self.renderer.show_question(question, index)
        self.renderer.show_timer(15, resolve_question)
        self.controller.ask_question(question)
