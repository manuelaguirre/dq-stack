import sys
import os
import pygame


class ScreenButton:
    def __init__(self, pos_x, pos_y, width, height, value, renderer):
        self.pos = (pos_x, pos_y)
        self.width = width
        self.height = height
        self.value = value
        self.selected = False  # TODO: Add missing states (correct / incorrect)
        self.renderer = renderer

    def toggle(self):
        self.selected = not self.selected
        self.display()

    def display(self):
        if self.selected:
            self.draw_button_full(
                self.pos[0] - self.width / 2,
                self.pos[1] - self.height / 2,
                self.width,
                self.height,
            )
            text_ = self.renderer.fonts["small"].render(
                self.value, True, (255, 255, 255)
            )
        else:
            self.draw_button_empty(
                self.pos[0] - self.width / 2,
                self.pos[1] - self.height / 2,
                self.width,
                self.height,
            )
            text_ = self.renderer.fonts["small"].render(self.value, True, (0, 0, 0))
        text_rect = text_.get_rect(center=(self.pos[0], self.pos[1]))
        self.renderer.screen.blit(text_, text_rect)

    def draw_button_empty(self, x, y, width, height):
        # TODO: Get image from state dictionary
        button_border = pygame.image.load(
            os.path.abspath(
                os.path.join(
                    os.path.dirname(__file__), "..", "images/icons/border_button.png"
                )
            )
        )
        button_border = pygame.transform.scale(button_border, (width, height))
        self.renderer.screen.blit(button_border, (x, y))

    def draw_button_full(self, x, y, width, height):
        button_border = pygame.image.load(
            os.path.abspath(
                os.path.join(
                    os.path.dirname(__file__),
                    "..",
                    "images/icons/border_button_full.png",
                )
            )
        )
        button_border = pygame.transform.scale(button_border, (width, height))
        self.renderer.screen.blit(button_border, (x, y))
