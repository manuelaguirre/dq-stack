import sys
import os
import time


class Coordinator:
    def __init__(self, controller, renderer):
        self.controller = controller
        self.renderer = renderer
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
        self.renderer.show_instructions()
        self.controller.request_confirmations()
        time.sleep(1)
        self.controller.get_theme_choices(self.mock_themes)
