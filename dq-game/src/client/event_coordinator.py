import os
import sys


class EventCoordinator:
    def __init__(self, controller, renderer):
        self.controller = controller
        self.renderer = renderer
        self.current_round_number = 0
        self.current_question = None
        self.current_score_board = None
        self.jokers = []
        self.active_joker = None

    def on_timeout(self):
        self.renderer.screen_handler.clear_data()
        self.renderer.show_logo()

    def on_answer_limit_reached(self):
        self.renderer.show_answer_limit_message()

    def on_set_username(self):
        self.renderer.username = self.controller.get_username()

    def on_show_instructions(self):
        """
        Gets instructions from server.
        Sends them to the renderer with a ready callback function.
        """
        instructions = self.controller.get_instructions()
        self.renderer.show_instructions_and_confirmation_button(
            instructions, self.controller.ready_up
        )

    def on_choose_theme(self):
        themes = self.controller.get_theme_list()
        self.renderer.select_themes(themes, self.controller.send_client_theme_choices)

    def on_start_round(self):
        self.current_round_number = self.controller.get_round_number()
        self.renderer.show_round_instructions(self.current_round_number)

    def on_show_upcoming_question_theme(self):
        self.current_question = self.controller.get_current_question()

        self.active_joker = None
        self.jokers = self.controller.get_jokers()

        self.renderer.show_upcoming_question_theme_and_jokers(
            self.current_question.theme, self.jokers, self._activate_joker_and_send
        )

    def _activate_joker_and_send(self, value, target=None):
        self.controller.send_joker(value, target=target)
        self.active_joker = value

    def on_answer_question(self):
        self.renderer.answer_question(
            self.current_question, self.active_joker, self.controller.send_answer
        )

    def on_resolve_question(self):
        self.renderer.show_results(self.current_question)

    def on_answer_is_wrong(self):
        self.renderer.show_answer_is_wrong()

    def on_show_scores(self):
        self.current_score_board = self.controller.get_score_board()
        self.renderer.show_scores(self.current_score_board)
