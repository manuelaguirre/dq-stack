import os
from events.event_handler import EventHandler
from utils.renderer_utils import renderTextCenteredAt
from utils.renderer import Renderer
import threading
import time


class ServerRenderer(Renderer):
    """
    Renderer for the server main app (Central app)
    TODO: Define super class Renderer to share it in the client
    """

    def __init__(self):
        super().__init__(1000, 600, "server")

    def show_instructions(self, instrucions):
        """
        Render the instructions
        """
        print("render instrucions")
        time.sleep(1)
        self.show_background()
        height_ins = 4 * self.SCREEN_HEIGHT / 6
        height_ins_i = 0.5 * self.SCREEN_HEIGHT / 6
        count = 1
        n = len(instrucions) + 1
        for instruction in instrucions:
            renderTextCenteredAt(
                self, instruction, count * height_ins / n + height_ins_i
            )
            count += 1
        self.update_screen()

    def show_chosen_themes(self, chosen_themes):
        self.show_background()
        separator = " "
        self.show_title("Les themes seront:")
        # TODO:justify between
        renderTextCenteredAt(
            self, separator.join(chosen_themes), 2 * self.SCREEN_HEIGHT / 3
        )
        self.update_screen()
        time.sleep(5)

    def show_question(self):
        pass

    def show_points(self):
        pass

    def show_timer(self):
        pass
