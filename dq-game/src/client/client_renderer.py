import math
import os
import sys
import threading
import time

from utils.renderer import Renderer
from utils.renderer_utils import renderTextCenteredAt, showTextAt

from client_screen_handler import ClientScreenHandler
from screen_button import ScreenButton


class ClientRenderer(Renderer):
    """
    Renderer for the client app
    """

    def __init__(self):
        super().__init__(1000, 600, "client")
        self.screen_handler = ClientScreenHandler()
        self.buttons_list = []
        # Select themes
        self.THEME_BUTTON_WIDTH = 230
        self.THEME_BUTTON_HEIGHT = 40
        self.selected_themes_num = 0
        self.selected_themes = []
        self.theme_validation_button = None
        self.validate_themes_callback = None
        self.answer_question_callback = None
        self.ready_callback = None
        self.append_touch_method(self.screen_handler.handle_touch)

    def create_buttons(self, value_list):
        # Create columns and rows
        columns = [4 * self.SCREEN_WIDTH / 11, 7 * self.SCREEN_WIDTH / 11]
        num_rows = math.ceil(len(value_list) / 2)
        rows = []
        for index in range(num_rows):
            rows.append(
                3 / 9 * self.SCREEN_HEIGHT
                + 5 / 9 * self.SCREEN_HEIGHT / (2 * num_rows + 1) * (2 * index + 1)
            )
        # Create one button per theme
        for index in range(len(value_list)):
            pos_x = columns[index % 2]
            pos_y = rows[math.floor(index / 2)]
            button = ScreenButton(
                pos_x,
                pos_y,
                self.THEME_BUTTON_WIDTH,
                self.THEME_BUTTON_HEIGHT,
                value_list[index],
                self,
            )
            self.buttons_list.append(button)
            self.screen_handler.add_object(button)

    def display_buttons(self):
        # Display all buttons
        for button in self.buttons_list:
            button.display()
        self.update_screen()

    def show_instructions_and_confirmation_button(self, instructions, callback):
        self.ready_callback = callback
        self.show_background()
        for i in range(len(instructions)):
            renderTextCenteredAt(
                self, instructions[i], (i + 1) * self.SCREEN_HEIGHT / 5
            )
        ready_button = ScreenButton(
            self.SCREEN_WIDTH / 2,
            4 * self.SCREEN_HEIGHT / 5,
            self.THEME_BUTTON_WIDTH,
            self.THEME_BUTTON_HEIGHT,
            "PRÊT",
            self,
        )
        self.screen_handler.add_object(ready_button)
        ready_button.display()
        self.update_screen()
        self.screen_handler.add_touch_callback(self.confirmation_button_callback)

    def confirmation_button_callback(self, value):
        if value:
            self.show_logo()
            self.screen_handler.clear_data()
            self.ready_callback()

    def select_themes(self, themes, callback):
        """
        Calculate rows and columns. Create buttons and display them with the screen handler
        """
        self.themes = themes
        self.validate_themes_callback = callback
        print(self.themes)
        time.sleep(1)
        self.create_buttons(self.themes)
        # Create validate button
        pos_x_validate = self.SCREEN_WIDTH / 2
        pos_y_validate = 8 / 9 * self.SCREEN_HEIGHT
        self.theme_validation_button = ScreenButton(
            pos_x_validate,
            pos_y_validate,
            self.THEME_BUTTON_WIDTH,
            self.THEME_BUTTON_HEIGHT,
            "Select",
            self,
        )
        self.buttons_list.append(self.theme_validation_button)
        self.screen_handler.add_object(self.theme_validation_button)
        # Attach callback method for touch event
        self.screen_handler.add_touch_callback(self.select_theme_event)
        # Display title and buttons
        self.show_background()
        self.show_title("Select 3 Themes")
        self.display_buttons()

    def select_theme_event(self, value):
        """
        Function called when a button is called
        """
        if value == self.theme_validation_button.value:
            # Validate button
            if self.theme_validation_button.selected:
                self.themes_selected_done()
        else:
            # Themes buttons
            for button in self.buttons_list:
                if button.value == value:
                    button.toggle()
                    # Check state of validate button
                    if button.selected:
                        self.selected_themes_num += 1
                        self.selected_themes.append(value)
                    else:
                        self.selected_themes_num -= 1
                        self.selected_themes = list(
                            filter(lambda x: x != value, self.selected_themes)
                        )
                    if self.selected_themes_num == 3:
                        self.theme_validation_button.selected = True
                        self.theme_validation_button.display()
                    else:
                        self.theme_validation_button.selected = False
                        self.theme_validation_button.display()
                    self.update_screen()
                    break

    def themes_selected_done(self):
        print(self.selected_themes)
        self.show_logo()
        self.screen_handler.clear_data()
        self.validate_themes_callback(self.selected_themes)

    def display_round_theme(self, round_theme):
        self.show_background()
        self.show_title(round_theme.name)
        showTextAt(
            self,
            "medium",
            self.SCREEN_WIDTH / 2,
            self.SCREEN_HEIGHT / 2,
            round_theme.description,
        )
        self.update_screen()

    def answer_question(self, current_question, current_theme, callback):
        self.show_background()
        self.show_title(current_theme.name, "medium")
        self.answer_question_callback = callback
        showTextAt(
            self,
            "medium",
            self.SCREEN_WIDTH / 2,
            self.SCREEN_HEIGHT / 3,
            current_question.text,
        )
        self.buttons_list = []
        self.create_buttons(current_question.answers)
        # Attach callback method for touch event
        self.screen_handler.add_touch_callback(self.select_answer_event)
        # Display title and buttons
        self.display_buttons()
        self.update_screen()

    def select_answer_event(self, value):
        print(value)
        for button in self.buttons_list:
            if button.value == value:
                button.toggle()
                self.update_screen()
        self.answer_question_callback(value)
