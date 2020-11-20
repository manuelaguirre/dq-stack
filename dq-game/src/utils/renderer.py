import os
import time

import pygame
from events.event_handler import EventHandler

from utils.renderer_utils import showTextAt
from utils.timer import Timer


class Renderer(EventHandler):
    """
    Renderer for the server main app (Central app)
    """

    def __init__(self, SCREEN_WIDTH, SCREEN_HEIGHT, RENDERER_TYPE):
        self.SCREEN_WIDTH = SCREEN_WIDTH
        self.SCREEN_HEIGHT = SCREEN_HEIGHT
        self.screen = pygame.display.set_mode((self.SCREEN_WIDTH, self.SCREEN_HEIGHT))
        self.fonts = {}
        self.logo = self._get_logo()
        self.background = self._get_background()
        self.timer = Timer(0)
        self.timer_background = self._get_timer_background()
        self.button_background = self._get_button_background()
        self.touch_function = None
        self.RENDERER_TYPE = RENDERER_TYPE
        self.base_path = os.path.dirname(__file__)

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
        self.trigger("RENDERER_START_GAME")
        running = True
        print("start running")
        while running:  # main game loop
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    pygame.quit()
                    print("stop running")
                    running = False
                elif event.type == pygame.MOUSEBUTTONDOWN:
                    if self.touch_function:
                        self.touch_function(event.pos[0], event.pos[1])
            time.sleep(0.1)

    def _get_logo(self):
        return pygame.image.load(
            os.path.abspath(
                os.path.join(os.path.dirname(__file__), "..", "images/icons/dqlogo.png")
            )
        )

    def _get_background(self):
        background = pygame.image.load(
            os.path.abspath(
                os.path.join(os.path.dirname(__file__), "..", "images/background.jpg")
            )
        )
        return pygame.transform.scale(
            background, (self.SCREEN_WIDTH, self.SCREEN_HEIGHT)
        )

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

    def _get_button_background(self):
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

    def append_touch_method(self, callback):
        # Function that will be called after every touch event
        self.touch_function = callback

    def show_background(self):
        """
        Clear the screen. Only display the background
        """
        self.screen.blit(self.background, (0, 0))
        self.update_screen()

    def show_logo(self):
        """
        Clear the screen and display logo
        """
        print("show_logo")
        self.show_background()
        logo_rect = self.logo.get_rect(
            center=(self.SCREEN_WIDTH / 2, self.SCREEN_HEIGHT / 2)
        )
        self.screen.blit(self.logo, logo_rect)
        self.update_screen()

    def show_timer(self, seconds, timeout_callback):
        # Show timer background
        timer_position = (self.SCREEN_WIDTH * 8 / 10, self.SCREEN_HEIGHT * 1 / 10)

        def render_timer(seconds):
            self.screen.blit(
                self.timer_background,
                timer_position,
            )
            showTextAt(
                self,
                "medium",
                timer_position[0] + self.SCREEN_WIDTH // 16,
                timer_position[1] + self.SCREEN_HEIGHT // 12,
                "00:" + f"{seconds:0>2}",
                (230, 230, 230),
            )
            self.update_screen()

        self.timer.reset(seconds, render_timer, timeout_callback)

    def show_title(self, text, font_size="large"):
        text_ = self.fonts[font_size].render(text, True, (0, 0, 0))
        text_rect = text_.get_rect(
            center=(self.SCREEN_WIDTH / 2, self.SCREEN_HEIGHT / 8)
        )
        self.screen.blit(text_, text_rect)

    def update_screen(self):
        pygame.display.update()
