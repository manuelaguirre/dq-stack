import importlib.util
import os
import sys
import time
from functools import wraps

import pygame
import text.text as text
from client.pages.score_board_page import ScoreBoardPage
from events.event_handler import EventHandler
from game_types.joker import JokerType
from pygame import mixer

from utils.renderer_utils import render_multiline_text, render_table, show_text_at
from utils.timer import Timer
from utils.screen import Screen

try:
    import RPi.GPIO as GPIO
except ImportError:
    import FakeRPi.GPIO as GPIO


GPIO.setmode(GPIO.BCM)

GPIO.setup(17, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(18, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(24, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(25, GPIO.IN, pull_up_down=GPIO.PUD_UP)

"""
0   1   2   3   4   5   6   7   8   9   10  11
|   |   |   |   |   |   |   |   |   |   |   |

      |   THEME   |       |   THEME   |

      |   THEME   |       |   THEME   |


0   1   2   3   4   5   6   7   8   9   10  11
|   |   |   |   |   |   |   |   |   |   |   |

    |     ANSWER    |   |     ANSWER    | 

    |     ANSWER    |   |     ANSWER    | 

"""


def flush(func):
    """
    Decorator for common renderer tasks
    """

    @wraps(func)
    def inner(self, *args, **kwargs):
        self.show_background()
        func(self, *args, **kwargs)
        self.update_screen()

    return inner


class Renderer(EventHandler):
    """
    Renderer for the server main app (Central app)
    """

    def __init__(self, SCREEN_WIDTH, SCREEN_HEIGHT, RENDERER_TYPE):
        self.username = ""
        self.SCREEN_WIDTH = SCREEN_WIDTH
        self.SCREEN_HEIGHT = SCREEN_HEIGHT
        self.THEME_BUTTON_WIDTH = 3 * self.SCREEN_WIDTH // 11
        self.THEME_BUTTON_HEIGHT = self.SCREEN_HEIGHT // 10
        self.ANSWER_BUTTON_WIDTH = 4 * self.SCREEN_WIDTH // 11
        self.ANSWER_BUTTON_HEIGHT = self.SCREEN_HEIGHT // 8
        
        self.main_screen = Screen(self.SCREEN_WIDTH, self.SCREEN_HEIGHT)

        self.fonts = {}
        self.timer = Timer(0)
        self.timer_background = self._get_timer_background()
        self.button_backgrounds = self._get_button_backgrounds()
        self.touch_function = None
        self.buzzer_function = None
        self.RENDERER_TYPE = RENDERER_TYPE
        self.base_path = os.path.dirname(__file__)
        self.joker_images = self.get_jokers_images()
        self.jokers_results_images = self.get_jokers_results_images()
        (
            self.correct_answer_image,
            self.wrong_answer_image,
        ) = self.get_answer_result_images()

    def initialize(self):
        """
        Initialize the renderer. Create pygame instance and call of the start game
        """
        pygame.init()
        self.fonts["small"] = pygame.font.Font(
            os.path.join(self.base_path, "fonts/YanoneKaffeesatz-Regular.ttf"),
            int(32 * self.SCREEN_HEIGHT / 600),
        )
        self.fonts["medium"] = pygame.font.Font(
            os.path.join(self.base_path, "fonts/YanoneKaffeesatz-Regular.ttf"),
            int(48 * self.SCREEN_HEIGHT / 600),
        )
        self.fonts["large"] = pygame.font.Font(
            os.path.join(self.base_path, "fonts/YanoneKaffeesatz-Regular.ttf"),
            int(96 * self.SCREEN_HEIGHT / 600),
        )
        if self.RENDERER_TYPE == "client":
            pygame.display.set_caption("DefiQuizz - Client")
        else:
            pygame.display.set_caption("DefiQuizz - Server")
        icon = pygame.image.load(
            os.path.abspath(
                os.path.join(
                    os.path.dirname(__file__), "..", "images/icons/favicon.png"
                )
            )
        )
        pygame.display.set_icon(icon)
        self.show_logo()
        self.trigger("RENDERER_INIT_DONE")
        running = True
        print("start running")
        while running:  # main game loop
            # if self.RENDERER_TYPE == "client":

            #     if GPIO.input(17) == 0:
            #         if self.buzzer_function:
            #             self.buzzer_function(0)

            #     elif GPIO.input(18) == 0:
            #         if self.buzzer_function:
            #             self.buzzer_function(1)

            #     elif GPIO.input(24) == 0:
            #         if self.buzzer_function:
            #             self.buzzer_function(2)

            #     elif GPIO.input(25) == 0:
            #         if self.buzzer_function:
            #             self.buzzer_function(3)

            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    pygame.quit()
                    print("stop running")
                    running = False
                elif event.type == pygame.MOUSEBUTTONDOWN:
                    if self.touch_function:
                        self.touch_function(event.pos[0], event.pos[1])
            time.sleep(0.1)

    def _get_timer_background(self):
        background = pygame.image.load(
            os.path.abspath(
                os.path.join(
                    os.path.dirname(__file__), "..", "images/timer_background.png"
                )
            )
        )
        return pygame.transform.scale(
            background, (self.SCREEN_WIDTH // 8, self.SCREEN_HEIGHT // 6)
        )

    def _get_button_backgrounds(self):
        return {
            "theme_normal": self._get_theme_button_background("normal"),
            "theme_selected": self._get_theme_button_background("selected"),
            "answer_normal": self._get_answer_button_background("normal"),
            "answer_selected": self._get_answer_button_background("selected"),
            "answer_correct": self._get_answer_button_background("correct"),
            "answer_wrong": self._get_answer_button_background("wrong"),
        }

    def _get_answer_button_background(self, state):
        return pygame.image.load(
            os.path.abspath(
                os.path.join(
                    os.path.dirname(__file__),
                    "..",
                    "images/icons/button_" + state + ".png",
                )
            )
        )

    def _get_theme_button_background(self, state):
        return pygame.image.load(
            os.path.abspath(
                os.path.join(
                    os.path.dirname(__file__),
                    "..",
                    "images/icons/theme_button_" + state + ".png",
                )
            )
        )

    def _get_joker_image(self, joker_type):
        """
        return { active: Image, inactive: Image }
        """
        active = pygame.image.load(
            os.path.abspath(
                os.path.join(
                    os.path.dirname(__file__),
                    "..",
                    "images/icons/jokers/" + joker_type.name + "_active.png",
                )
            )
        )
        inactive = pygame.image.load(
            os.path.abspath(
                os.path.join(
                    os.path.dirname(__file__),
                    "..",
                    "images/icons/jokers/" + joker_type.name + "_inactive.png",
                )
            )
        )
        return {"active": active, "inactive": inactive}

    def get_jokers_images(self):
        joker_images = {}
        for joker_type in JokerType:
            joker_images[joker_type.name] = self._get_joker_image(joker_type)
        return joker_images

    def get_jokers_results_images(self):
        joker_images = {}
        for joker_type in JokerType:
            joker_images[joker_type.name] = pygame.image.load(
                os.path.abspath(
                    os.path.join(
                        os.path.dirname(__file__),
                        "..",
                        "images/icons/answer_results/" + joker_type.name + ".png",
                    )
                )
            )
        return joker_images

    def get_answer_result_images(self):
        correct_image = pygame.image.load(
            os.path.abspath(
                os.path.join(
                    os.path.dirname(__file__),
                    "..",
                    "images/icons/answer_results/correct.png",
                )
            )
        )
        wrong_image = pygame.image.load(
            os.path.abspath(
                os.path.join(
                    os.path.dirname(__file__),
                    "..",
                    "images/icons/answer_results/wrong.png",
                )
            )
        )
        return correct_image, wrong_image

    def update_screen(self):
        pygame.display.update()

    def append_touch_method(self, callback):
        # Function that will be called after every touch event
        self.touch_function = callback

    def append_buzzer_method(self, callback):
        # Function that will be called after every touch event
        self.buzzer_function = callback

    def show_background(self):
        """
        Clear the screen. Only display the background
        """
        self.main_screen.show_background()

    def show_logo(self):
        """
        Clear the screen and display logo
        """
        self.main_screen.show_logo()

    def show_timer(self, seconds, timeout_callback):
        # Show timer background
        timer_position = (self.SCREEN_WIDTH * 8 / 10, self.SCREEN_HEIGHT * 1 / 10)

        def render_timer(seconds):
            self.main_screen.screen_instance.blit(
                self.timer_background,
                timer_position,
            )
            show_text_at(
                self,
                "medium",
                timer_position[0] + self.SCREEN_WIDTH // 16,
                timer_position[1] + self.SCREEN_HEIGHT // 12,
                "00:" + f"{seconds:0>2}",
                (230, 230, 230),
            )
            self.update_screen()

        self.timer.reset(seconds, render_timer, timeout_callback)

    def stop_timer(self):
        self.timer.stop()

    def show_title(self, text, font_size="large"):
        text_ = self.fonts[font_size].render(text, True, (0, 0, 0))
        text_rect = text_.get_rect(
            center=(self.SCREEN_WIDTH / 2, self.SCREEN_HEIGHT / 8)
        )
        self.main_screen.screen_instance.blit(text_, text_rect)

    @flush
    def show_round_instructions(self, game_round_number):
        self.show_title(f"MANCHE {game_round_number}")

        render_multiline_text(
            self,
            text.round_instructions[game_round_number - 1],
            self.SCREEN_HEIGHT / 3,
            font_size="medium",
        )

    def show_scores(self, score_board):
        score_board_page = ScoreBoardPage(self)
        score_board_page.set_data(
            score_board,
            self.correct_answer_image,
            self.wrong_answer_image,
            self.jokers_results_images,
        )
        score_board_page.render()
        score_board_page.finish()
