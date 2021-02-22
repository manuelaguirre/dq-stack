import time

from client.pages.page_interface import Page
from utils.renderer_utils import render_table


class ScoreBoardPage(Page):
    def __init__(self, renderer):
        self.renderer = renderer
        self.score_board = None
        self.icons = {}

    def render(self):
        self.renderer.show_background()
        self.renderer.update_screen()
        self.show_score()

    def show_score(self):
        # Display board with joker actions
        if self.score_board.played_jokers:
            joker_table = self.score_board.get_board_with_jokers()
            self.renderer.show_background()
            render_table(
                self.renderer,
                joker_table,
                (1, 4, 1, 3),
                self.renderer.username,
                self.icons,
            )
            self.renderer.update_screen()
            time.sleep(4)

        # Display score board with ranking
        points_transition = self.score_board.get_points_transition()
        is_first = True
        for board_frame in points_transition:
            self.renderer.show_background()
            render_table(
                self.renderer,
                board_frame,
                (1, 4, 1, 1),
                self.renderer.username,
                self.icons,
            )
            self.renderer.update_screen()
            if is_first:
                time.sleep(3)
                is_first = False
            else:
                time.sleep(0.05)

        sort_transition = self.score_board.get_sort_transition()
        is_first = True
        for board_frame in sort_transition:
            if is_first:
                time.sleep(1.5)
                is_first = False
            else:
                time.sleep(0.4)
            self.renderer.show_background()
            render_table(
                self.renderer,
                board_frame,
                (1, 4, 1, 1),
                self.renderer.username,
                self.icons,
            )
            self.renderer.update_screen()

    def set_data(self, data, correct_image, wrong_image, jokers_results_images):
        self.score_board = data
        self.icons = {
            "CORRECT": correct_image,
            "WRONG": wrong_image,
            "NONE": None,
        }
        for joker_name in jokers_results_images:
            self.icons[joker_name] = jokers_results_images[joker_name]

    def set_callback(self, callback):
        pass

    def finish(self):
        self.renderer.show_background()

    def _show_title(self):
        pass
