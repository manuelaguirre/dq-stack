import os
import sys


class EventCoordinator:
    def __init__(self, controller, renderer):
        self.controller = controller
        self.renderer = renderer
        self.current_round_number = 0
        self.current_question = None

    def on_timeout(self):
        self.renderer.screen_handler.clear_data()
        self.renderer.show_logo()

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
        self.renderer.show_upcoming_question_theme(self.current_question.theme)

    def on_answer_question(self):
        self.renderer.answer_question(
            self.current_question, self.controller.send_answer
        )

    def on_resolve_question(self):
        self.renderer.show_results(self.current_question)
