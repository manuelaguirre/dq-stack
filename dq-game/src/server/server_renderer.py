import os
from events.event_handler import EventHandler
from utils.renderer_utils import renderTextCenteredAt
from utils.renderer import Renderer
import threading
from mock_data import mock_instructions
import time


class ServerRenderer(Renderer):
    """
    Renderer for the server main app (Central app)
    TODO: Define super class Renderer to share it in the client
    """

    def __init__(self):
        super().__init__(1000, 600)

    def show_instructions(self):
        """
        Public method to renderer the instructions async
        """
        threading.Thread(target=self._show_instructions).start()

    def _show_instructions(self):
        """
        Renderer the instructions
        """
        print("render instrucions")
        time.sleep(1)
        self.show_background()
        height_ins = 4 * self.SCREEN_HEIGHT / 6
        height_ins_i = 0.5 * self.SCREEN_HEIGHT / 6
        count = 1
        n = len(mock_instructions) + 1
        for instruction in mock_instructions:
            renderTextCenteredAt(
                self, instruction, count * height_ins / n + height_ins_i
            )
            count += 1
        self.update_screen()
        time.sleep(1)
        self.show_logo()
        print("finish render instrucions")

    def show_question(self):
        pass

    def show_points(self):
        pass

    def show_timer(self):
        pass
