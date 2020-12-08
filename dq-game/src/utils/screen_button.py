import sys
import os
import pygame


class ScreenButton:
    """
    Screen button for themes and answers
    """

    def __init__(
        self, pos_x, pos_y, width, height, value, button_backgrounds, screen, font
    ):
        # Convert inputs to integer
        self.pos = (int(pos_x), int(pos_y))
        self.width = int(width)
        self.height = int(height)
        self.value = value
        self.button_backgrounds = button_backgrounds
        self.screen = screen
        self.font = font
        self.state = "normal"
        self.selected = False
        self.badge = None
        print(self.button_backgrounds)

    def display(self):
        raise NotImplementedError

    def draw_button(self):
        button_image = self.get_button_image()
        proportion = self.width / button_image.get_rect().width
        scaled_height = int(proportion * button_image.get_rect().height)
        button_image_scaled = pygame.transform.scale(
            button_image, (self.width, scaled_height)
        )
        button_image_rect = button_image_scaled.get_rect(center=self.pos)
        self.screen.blit(button_image_scaled, button_image_rect)

    def get_button_image(self):
        raise NotImplementedError

    def get_font_color(self):
        raise NotImplementedError

    def display_text(self, font_color):
        raise NotImplementedError

    def display_badge(self, number):
        raise NotImplementedError


class ThemeScreenButton(ScreenButton):
    def display(self):
        self.draw_button()
        font_color = self.get_font_color()
        self.display_text(font_color)

    def toggle(self):
        self.selected = not self.selected
        self.display()

    def get_button_image(self):
        if self.selected:
            return self.button_backgrounds["theme_selected"]
        return self.button_backgrounds["theme_normal"]

    def get_font_color(self):
        return (255, 255, 255) if self.selected else (0, 0, 0)

    def display_text(self, font_color):
        text = self.font.render(self.value, True, font_color)
        text_rect = text.get_rect(center=(self.pos[0], self.pos[1]))
        self.screen.blit(text, text_rect)


class AnswerScreenButton(ScreenButton):
    def display(self):
        self.draw_button()
        font_color = self.get_font_color()
        self.display_text(font_color)

    def set_letter(self, letter):
        self.letter = letter

    def set_state(self, state):
        self.state = state
        self.display()

    def get_button_image(self):
        return self.button_backgrounds["answer_" + self.state]

    def get_font_color(self):
        return (0, 0, 0) if self.state == "normal" else (255, 255, 255)

    def display_text(self, font_color):
        text = self.font.render(self.value, True, font_color)
        pos_x = self.pos[0] + self.width / 15
        pos_y = self.pos[1] + self.height / 8
        text_rect = text.get_rect(center=(pos_x, pos_y))
        self.screen.blit(text, text_rect)
        letter = self.font.render(self.letter, True, (255, 255, 255))
        pos_y = self.pos[1]
        pos_x = self.pos[0] - self.width / 2 + self.width / 10
        letter_rect = letter.get_rect(center=(pos_x, pos_y))
        self.screen.blit(letter, letter_rect)


class JokerButton(ScreenButton):
    def display(self):
        self.draw_button()
        if self.badge:
            self.display_badge(self.badge)

    def get_button_image(self):
        return self.button_backgrounds[self.state]

    def set_state(self, state):
        self.state = state

    def add_badge(self, badge):
        self.badge = badge

    def display_badge(self, badge_image):
        badge_pos_x = self.pos[0] + self.width / 2
        badge_pos_y = self.pos[1] - self.height / 2
        button_image_scaled = pygame.transform.scale(
            badge_image, (self.width // 4, self.height // 4)
        )
        badge_rect = button_image_scaled.get_rect(center=(badge_pos_x, badge_pos_y))
        self.screen.blit(button_image_scaled, badge_rect)
