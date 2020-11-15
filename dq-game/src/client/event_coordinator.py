import os
import sys


class EventCoordinator:
    def __init__(self, controller, renderer):
        self.controller = controller
        self.renderer = renderer

    def on_show_instructions(self):
        """
        Gets instructions from server.
        Sends them to the renderer with a ready callback function.
        """
        instructions = self.controller.get_instructions()
        self.renderer.on_show_instructions_and_confirmation_button(
            instructions, self.controller.ready_up
        )

    def on_choose_theme(self):
        themes = self.controller.get_theme_list()
        self.renderer.select_themes(themes, self.controller.send_client_theme_choices)
