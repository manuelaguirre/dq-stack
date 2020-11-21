import sys
import os
import pygame


class ScreenButton:
    """
    Screen button for themes and answers
    """

    def __init__(self, pos_x, pos_y, width, height, value, renderer):
        # Convert inputs to integer
        self.pos = (int(pos_x), int(pos_y))
        self.width = int(width)
        self.height = int(height)
        self.value = value
        self.renderer = renderer
        self.state = "normal"
        self.selected = False

    def display(self):
        self.draw_button(
            self.pos[0] - self.width // 2,
            self.pos[1] - self.height // 2,
            self.width,
            self.height,
        )
        font_color = self.get_font_color()
        text_ = self.renderer.fonts["small"].render(self.value, True, font_color)
        text_rect = text_.get_rect(center=(self.pos[0], self.pos[1]))
        self.renderer.screen.blit(text_, text_rect)

    def draw_button(self, x, y, width, height):
        raise NotImplementedError

    def get_font_color(self):
        raise NotImplementedError


class ThemeScreenButton(ScreenButton):
    def toggle(self):
        self.selected = not self.selected
        self.display()

    def draw_button(self, x, y, width, height):
        # TODO: Get image from state dictionary
        button_border = pygame.image.load(
            os.path.abspath(
                os.path.join(
                    os.path.dirname(__file__),
                    "..",
                    "images/icons/theme_button_"
                    + ("selected" if self.selected else "normal")
                    + ".png",
                )
            )
        )
        button_border = pygame.transform.scale(button_border, (width, height))
        self.renderer.screen.blit(button_border, (x, y))

    def get_font_color(self):
        return (255, 255, 255) if self.selected else (0, 0, 0)


class AnswerScreenButton(ScreenButton):
    def set_state(self, state):
        self.state = state
        self.display()

    def draw_button(self, x, y, width, height):
        button_border = pygame.image.load(
            os.path.abspath(
                os.path.join(
                    os.path.dirname(__file__),
                    "..",
                    "images/icons/button_" + self.state + ".png",
                )
            )
        )
        button_border = pygame.transform.scale(button_border, (width, height))
        self.renderer.screen.blit(button_border, (x, y))

    def get_font_color(self):
        return (0, 0, 0) if self.state == "selected" else (255, 255, 255)
