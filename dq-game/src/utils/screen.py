import os
from functools import wraps

import pygame


def flush(func):
    """
    Decorator for common renderer tasks
    """

    @wraps(func)
    def inner(self, *args, **kwargs):
        self.show_background()
        func(self, *args, **kwargs)
        pygame.display.update()

    return inner

def _get_logo():
    return pygame.image.load(
        os.path.abspath(
            os.path.join(os.path.dirname(__file__), "..", "images/icons/dqlogo.png")
        )
    )

def _get_background():
    return pygame.image.load(
        os.path.abspath(
            os.path.join(os.path.dirname(__file__), "..", "images/background.jpg")
        )
    )

class Screen():
    """
    DQ Screen. Controls the rendering of the pygame screen
    """
    logo = _get_logo()
    background_image = _get_background()

    def __init__(self, SCREEN_WIDTH, SCREEN_HEIGHT):
        self.SCREEN_WIDTH = SCREEN_WIDTH
        self.SCREEN_HEIGHT = SCREEN_HEIGHT
        self.background_image_scaled = pygame.transform.scale(
            Screen.background_image, (self.SCREEN_WIDTH, self.SCREEN_HEIGHT)
        )
        self.screen_instance = pygame.display.set_mode((self.SCREEN_WIDTH, self.SCREEN_HEIGHT))

    @flush
    def show_logo(self):
        """
        Clear the screen and display logo
        """
        logo_rect = Screen.logo.get_rect(
            center=(self.SCREEN_WIDTH / 2, self.SCREEN_HEIGHT / 2)
        )
        self.screen_instance.blit(Screen.logo, logo_rect)

    def show_background(self):
        """
        Clear the screen. Only display the background
        """
        self.screen_instance.blit(self.background_image_scaled, (0, 0))
