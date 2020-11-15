import sys
import os
import time


class Coordinator:
    def __init__(self, controller, renderer, dq_game):
        self.controller = controller
        self.renderer = renderer
        self.dq_game = dq_game
        self.mock_themes = [
            "Historia",
            "Sport",
            "Matemática",
            "Cultura general",
            "Geografía",
            "Naturaleza",
            "Sociología",
        ]

    def start(self):
        self.controller.await_connections()
        self.renderer.show_instructions(self.dq_game.instructions)
        self.controller.send_instructions_and_await_confirmations(self.dq_game.instructions)
        time.sleep(1)
        self.controller.get_theme_choices(self.mock_themes)
