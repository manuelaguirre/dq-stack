import os
import sys
import time

from utils.renderer import Renderer, flush
from utils.renderer_utils import show_text_at
from utils.screen_button import AnswerScreenButton


class FrontRenderer(Renderer):
    def __init__(self):
        super().__init__(600, 400, "client")
        self.total_points = 0

    @flush
    def on_timeout(self):
        # Show timeout image
        timeoutlogo_rect = self.timeoutlogo.get_rect(
            center=(self.SCREEN_WIDTH / 2, self.SCREEN_HEIGHT / 2)
        )
        self.screen.blit(self.timeoutlogo, timeoutlogo_rect)

    def show_block(self, blocking_player):
        # Show blocked image with player name
        self.display_joker_big(self.joker_images["BLOCK"]["active"], blocking_player)
        pass

    def show_steal(self, stealing_player):
        # Show blocked image with player name
        self.display_joker_big(self.joker_images["STEAL"]["active"], stealing_player)
        pass

    @flush
    def show_username(self):
        # Show text with the username and total points
        # |                     |
        # |     SEBASTIAN       |
        # |         0           |
        # |                     |
        show_text_at(
            self,
            "large",
            self.SCREEN_WIDTH / 2,
            3 * self.SCREEN_HEIGHT / 8,
            self.username,
        )
        show_text_at(
            self,
            "large",
            self.SCREEN_WIDTH / 2,
            5 * self.SCREEN_HEIGHT / 8,
            str(self.total_points),
        )

    @flush
    def on_show_upcoming_question_theme(self, theme):
        # Show text with the next theme
        show_text_at(
            self,
            "large",
            self.SCREEN_WIDTH / 2,
            3 * self.SCREEN_HEIGHT / 8,
            "Prochain theme:",
        )
        show_text_at(
            self,
            "large",
            self.SCREEN_WIDTH / 2,
            5 * self.SCREEN_HEIGHT / 8,
            theme,
        )
        pass

    @flush
    def show_answer(self, player_answer, choice_letter, status):
        # Show selected answer and its status
        button = AnswerScreenButton(
            self.SCREEN_WIDTH // 2,
            self.SCREEN_HEIGHT // 2,
            5 * self.SCREEN_WIDTH / 6,
            self.SCREEN_HEIGHT / 8,
            player_answer,
            self.button_backgrounds,
            self.screen,
            self.fonts["large"],
        )
        button.set_letter(choice_letter)
        button.set_state(status)

    @flush
    def show_scores(self, differential, total_points):
        # Show differential and then show total points
        show_text_at(
            self,
            "ultralarge",
            self.SCREEN_WIDTH / 2,
            self.SCREEN_HEIGHT / 2,
            "+" + str(differential) if differential > 0 else str(differential),
            (25, 220, 25) if differential > 0 else (220, 25, 25),
        )
        self.update_screen()
        time.sleep(2)
        self.show_username()
