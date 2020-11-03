import sys
import os
from utils.renderer import Renderer
import threading
import math
import time


class ClientRenderer(Renderer):
    """
    Renderer for the client app
    """

    def __init__(self):
        super().__init__(1000, 600)

    def select_themes(self, themes):
        self.themes = themes
        threading.Thread(target=self._select_themes).start()

    def _select_themes(self):
        print(self.themes)
        time.sleep(1)
        self.show_background()
        columns = [4 * self.SCREEN_WIDTH / 11, 7 * self.SCREEN_WIDTH / 11]
        num_rows = math.ceil(len(self.themes) / 2)
        rows = []
        for index in range(num_rows):
            rows.append(
                2 / 9 * self.SCREEN_HEIGHT
                + 7 / 9 * self.SCREEN_HEIGHT / (2 * num_rows + 1) * (2 * index + 1)
            )
        for index in range(len(self.themes)):
            self.display_button(
                self.themes[index], columns[index % 2], rows[math.floor(index / 2)]
            )
