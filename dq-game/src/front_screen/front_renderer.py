import os
import sys
from utils.renderer import Renderer


class FrontRenderer(Renderer):
    def __init__(self):
        super().__init__(400, 400, "client")
        total_points = 0

    def on_timeout(self):
        # Show timeout image
        pass

    def show_block(self, blocking_player):
        # Show blocked image with player name
        pass

    def show_username(self):
        # Show text with the username and total points
        # |     SEBASTIAN       |
        # |         0           |
        pass

    def on_show_upcoming_question_theme(self, theme):
        # Show text with the next theme
        pass

    def show_answer(self, player_answer, status):
        # Show selected answer and its status
        pass

    def show_scores(self, differential, total_points):
        # Show differential and then show total points
        # self.total_points = total_points
        pass
