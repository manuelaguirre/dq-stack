import os
import threading
import time

import pygame
from events.event_handler import EventHandler
from utils.renderer import Renderer
from utils.renderer_utils import renderTextCenteredAt, showTextAt


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

    def show_available_themes(self, themes):
        """
        Render available themes
        """
        self.show_background()
        self.show_title("Choisissez 3 thèmes")
        rows = []
        # From 1/3 screen until 5/6
        num_rows = len(themes) // 2 + 1
        # ( 5/6 - 1/3 ) / num_rows
        for i in range(num_rows):
            rows.append(
                self.SCREEN_HEIGHT / 3
                + (5 / 6 - 1 / 3) * self.SCREEN_HEIGHT * i / num_rows
            )
        for i in range(len(themes)):
            showTextAt(
                self,
                "medium",
                self.SCREEN_WIDTH * (i % 2 + 1) / 3,
                rows[i // 2],
                themes[i],
            )
        self.update_screen()

    def show_chosen_themes(self, chosen_themes):
        self.timer.stop()
        self.show_background()
        self.show_title("Les themes seront:")
        for i in range(len(chosen_themes)):
            showTextAt(
                self,
                "medium",
                (1 + i) * self.SCREEN_WIDTH / 4,
                self.SCREEN_HEIGHT / 2,
                chosen_themes[i],
            )
        self.update_screen()
        time.sleep(5)

    def show_round(self, round):
        self.show_background()
        self.show_title(round.theme.name)
        showTextAt(
            self,
            "medium",
            self.SCREEN_WIDTH / 2,
            self.SCREEN_HEIGHT / 2,
            round.theme.description,
        )
        self.update_screen()

    def show_question(self, question, theme, index):
        self.show_background()
        self.show_title(theme.name, "medium")
        showTextAt(
            self,
            "small",
            self.SCREEN_WIDTH / 2,
            self.SCREEN_HEIGHT / 4,
            f"QUESTION {index + 1}",
        )
        if question.image_filename:
            image = pygame.image.load(
                os.path.abspath(
                    os.path.join(
                        os.path.dirname(__file__),
                        "..",
                        "server/tmp",
                        question.image_filename,
                    )
                )
            )
            self.screen.blit(image, (0, self.SCREEN_HEIGHT / 2))

        renderTextCenteredAt(self, question.text, self.SCREEN_HEIGHT * 5 / 8, "medium")
        self.update_screen()
