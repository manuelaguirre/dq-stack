from client.pages.page_interface import Page
from game_types.joker import JokerType
import pygame
import random
import time


class JokerLotteryPage(Page):
    def __init__(self, renderer, screen_handler):
        self.renderer = renderer
        self.screen_handler = screen_handler
        self.callback = None

    def render(self):
        self.renderer.show_background()
        self._show_title()
        self.display_jokers_animation()

    def display_jokers_animation(self):
        joker1 = None
        joker2 = None

        for i in range(80):
            joker1 = JokerType(random.randint(0, 3)).name
            joker2 = JokerType(random.randint(0, 3)).name
            joker_image_left = self.renderer.joker_images[joker1]["active"]
            joker_image_right = self.renderer.joker_images[joker2]["active"]

            image_width = self.renderer.SCREEN_WIDTH // 4
            proportion = image_width / joker_image_left.get_rect().width
            image_height = proportion * joker_image_left.get_rect().height

            joker_image_scaled_left = pygame.transform.scale(
                joker_image_left, (int(image_width), int(image_height))
            )
            joker_image_scaled_right = pygame.transform.scale(
                joker_image_right, (int(image_width), int(image_height))
            )

            joker_image_rect_left = joker_image_scaled_left.get_rect(
                center=(
                    1 * self.renderer.SCREEN_WIDTH // 3,
                    3 * self.renderer.SCREEN_HEIGHT // 5,
                )
            )
            joker_image_rect_right = joker_image_scaled_right.get_rect(
                center=(
                    2 * self.renderer.SCREEN_WIDTH // 3,
                    3 * self.renderer.SCREEN_HEIGHT // 5,
                )
            )

            self.renderer.screen.blit(joker_image_scaled_left, joker_image_rect_left)
            self.renderer.screen.blit(joker_image_scaled_right, joker_image_rect_right)
            self.renderer.update_screen()
            time.sleep(0.05)

        time.sleep(3)
        self.finish([joker1, joker2])

    def set_data(self, data):
        pass

    def set_callback(self, callback):
        self.callback = callback

    def finish(self, value):
        self.callback(value)

    def _show_title(self):
        self.renderer.show_title("Joker lottery")
