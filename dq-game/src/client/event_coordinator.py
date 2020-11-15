import os
import sys


class EventCoordinator:
    def __init__(self, controller, renderer):
        self.controller = controller
        self.renderer = renderer

    def on_connected(self):
        self.renderer.show_ready_button(self.controller.ready_up)

    def on_choose_theme(self):
        themes = self.controller.get_theme_list()
        self.renderer.select_themes(themes, self.controller.send_client_theme_choices)
