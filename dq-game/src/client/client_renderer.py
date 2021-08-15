import math
import os
import sys
import threading
import time
from collections import Counter

import pygame
from client.pages.select_player_page import SelectPlayerPage
from game_types.joker import JokerType
from utils.renderer import Renderer, flush
from utils.renderer_utils import render_multiline_text, show_text_at, chop_answers
from utils.screen_button import AnswerScreenButton, JokerButton, ThemeScreenButton

from client_screen_handler import ClientScreenHandler


class ClientRenderer(Renderer):
    """
    Renderer for the client app
    """

    def __init__(self):
        super().__init__(1000, 600, "client")
        self.screen_handler = ClientScreenHandler()
        self.buttons_list = []
        # Select themes
        self.selected_themes_num = 0
        self.selected_themes = []
        self.theme_validation_button = None
        self.validate_themes_callback = None
        self.answer_question_callback = None
        self.joker_callback = None
        self.ready_callback = None
        self.append_touch_method(self.screen_handler.handle_touch)
        self.append_buzzer_method(self.screen_handler.handle_buzzer)
        self.joker_images = self.get_jokers_images()
        self.badge_images = self.get_badge_images()

        self.username = None
        self.player_name_list = []
        self.blocking_player = None

    def get_badge_images(self):
        badge_images = {}
        for i in range(7):
            badge_images[i + 2] = pygame.image.load(
                os.path.abspath(
                    os.path.join(
                        os.path.dirname(__file__),
                        "..",
                        "images/icons/jokers/BADGE_" + str(i + 2) + ".png",
                    )
                )
            )
        return badge_images

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
        return badge_images

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

    def create_buttons(self, value_list, button_type):
        # Create columns and rows

        # Display columns at 3/11 and 8/11 REF: renderer.py
        columns = []
        num_rows = math.ceil(len(value_list) / 2)
        rows = []

        space_for_rows_margin = 0
        space_for_rows_total = 0

        if button_type == "Themes":
            # Display rows from 1/3 of the screen until 5/6 #REF: renderer.py
            columns = [3 * self.SCREEN_WIDTH / 11, 8 * self.SCREEN_WIDTH / 11]
            space_for_rows_margin = 1 / 3 * self.SCREEN_HEIGHT
            space_for_rows_total = (5 / 6 - 1 / 3) * self.SCREEN_HEIGHT
        else:
            # Display rows from 5/8 of the screen until 5/6 #REF: renderer.py
            columns = [3 * self.SCREEN_WIDTH / 11, 8 * self.SCREEN_WIDTH / 11]
            space_for_rows_margin = 5 / 8 * self.SCREEN_HEIGHT
            space_for_rows_total = (5 / 6 - 1 / 2) * self.SCREEN_HEIGHT

        space_for_row = space_for_rows_total / num_rows

        for index in range(num_rows):
            rows.append(space_for_rows_margin + space_for_row * index)

        # Create one button per theme or answer
        answer_letters = ["A", "B", "C", "D"]

        for index in range(len(value_list)):
            pos_x = columns[index % 2]
            pos_y = rows[math.floor(index / 2)]
            if button_type == "Themes":
                button = ThemeScreenButton(
                    pos_x,
                    pos_y,
                    self.THEME_BUTTON_WIDTH,
                    self.THEME_BUTTON_HEIGHT,
                    value_list[index],
                    self.button_backgrounds,
                    self.screen,
                    self.fonts["small"],
                )
            else:
                button = AnswerScreenButton(
                    pos_x,
                    pos_y,
                    self.ANSWER_BUTTON_WIDTH,
                    self.ANSWER_BUTTON_HEIGHT,
                    value_list[index],
                    self.button_backgrounds,
                    self.screen,
                    self.fonts["small"],
                )
                button.set_letter(answer_letters[index % len(answer_letters)])
            self.buttons_list.append(button)
            self.screen_handler.add_object(button)

    def display_buttons(self):
        # Display all buttons
        for button in self.buttons_list:
            button.display()
        self.update_screen()

    @flush
    def show_instructions_and_confirmation_button(self, instructions, callback):
        self.ready_callback = callback
        self.show_title("Règles du jeu")
        for i in range(len(instructions)):
            render_multiline_text(
                self, instructions[i], (i + 1) * self.SCREEN_HEIGHT / 5
            )
        ready_button = ThemeScreenButton(
            self.SCREEN_WIDTH / 2,
            4 * self.SCREEN_HEIGHT / 5,
            self.THEME_BUTTON_WIDTH,
            self.THEME_BUTTON_HEIGHT,
            "PRÊT",
            self.button_backgrounds,
            self.screen,
            self.fonts["small"],
        )
        self.screen_handler.add_object(ready_button)
        ready_button.display()
        self.screen_handler.add_touch_callback(self.confirmation_button_callback)

    def confirmation_button_callback(self, value):
        if value:
            self.show_logo()
            self.update_screen()
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
        self.create_buttons(self.themes, "Themes")
        # Create validate button
        pos_x_validate = self.SCREEN_WIDTH / 2
        pos_y_validate = 8 / 9 * self.SCREEN_HEIGHT
        self.theme_validation_button = ThemeScreenButton(
            pos_x_validate,
            pos_y_validate,
            self.THEME_BUTTON_WIDTH,
            self.THEME_BUTTON_HEIGHT,
            "Select",
            self.button_backgrounds,
            self.screen,
            self.fonts["small"],
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
            return
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

    @flush
    def answer_question(self, current_question, active_joker, callback):
        self.show_title(current_question.theme.name, "medium")
        self.answer_question_callback = callback
        render_multiline_text(
            self,
            current_question.text,
            self.SCREEN_HEIGHT / 3,
            "medium",
        )
        self.buttons_list = []

        if active_joker == "FIFTYFIFTY":
            current_question.answers, current_question.correct_answer = chop_answers(
                current_question.answers, current_question.correct_answer
            )

        self.create_buttons(current_question.answers, "Answers")
        # Attach callback method for touch event
        self.screen_handler.add_touch_callback(self.select_answer_event)
        self.screen_handler.add_buzzer_callback(self.select_answer_event)
        # Display title and buttons
        self.display_buttons()

    @flush
    def show_upcoming_question_theme_and_jokers(self, theme, jokers, callback):
        self.show_title(theme.name)
        jokers_count = Counter()  #  { JokerType.DOUBLE: 1, ... }
        has_jokers = False
        for joker in jokers:
            jokers_count[joker.joker_type.name] += 1
            has_jokers = True
        show_text_at(
            self,
            "medium",
            self.SCREEN_WIDTH / 2,
            self.SCREEN_HEIGHT / 3,
            "Voulez-vous utiliser un joker ?"
            if has_jokers
            else "Vous n'avez plus de joker",
        )
        self.show_jokers(jokers, callback, jokers_count)

    def show_jokers(self, jokers, callback, jokers_count):
        # Create counter
        self.joker_callback = callback
        self.buttons_list = []

        # Show every type (active or inactive)
        columns = [
            self.SCREEN_WIDTH / 8,
            3 * self.SCREEN_WIDTH / 8,
            5 * self.SCREEN_WIDTH / 8,
            7 * self.SCREEN_WIDTH / 8,
        ]
        for joker_type in JokerType:
            button_width = self.SCREEN_WIDTH / 8
            proportion = (self.SCREEN_WIDTH / 8) / self.badge_images[2].get_rect().width
            button_height = self.badge_images[2].get_rect().height * proportion
            button = JokerButton(
                columns[joker_type.value],
                2 * self.SCREEN_HEIGHT / 3,
                button_width,
                button_height,
                joker_type.name if jokers_count[joker_type.name] > 0 else None,
                self.joker_images[joker_type.name],
                self.screen,
                self.fonts["small"],
            )
            if not jokers_count[joker_type.name]:
                button.set_state("inactive")
            else:
                button.set_state("active")
                if jokers_count[joker_type.name] > 1:
                    button.add_badge(self.badge_images[jokers_count[joker_type.name]])
            self.buttons_list.append(button)
            self.screen_handler.add_object(button)
        self.screen_handler.add_touch_callback(self.joker_selection_callback)
        self.display_buttons()
        print(self.buttons_list)

    def joker_selection_callback(self, value):
        if not value:
            return
        self.screen_handler.clear_data()
        if value == "FIFTYFIFTY":
            self.display_joker_big(self.joker_images[value]["active"])
            self.fiftyfifty_callback(value)
        if value == "DOUBLE":
            self.display_joker_big(self.joker_images[value]["active"])
            self.double_callback(value)
        if value == "BLOCK":
            self.block_callback(value)
        if value == "STEAL":
            self.steal_callback(value)

    def fiftyfifty_callback(self, value):
        self.joker_callback(value)

    def double_callback(self, value):
        self.joker_callback(value)

    def block_callback(self, value):
        page = SelectPlayerPage(self, self.screen_handler)
        page.set_data(self.player_name_list)

        def choose_player_callback(target):
            self.display_joker_big(self.joker_images[value]["active"])
            self.joker_callback(value, target)

        page.set_callback(choose_player_callback)
        page.render()

    def steal_callback(self, value):
        page = SelectPlayerPage(self, self.screen_handler)
        page.set_data(self.player_name_list)

        def choose_player_callback(target):
            self.display_joker_big(self.joker_images[value]["active"])
            self.joker_callback(value, target)

        page.set_callback(choose_player_callback)
        page.render()

    def select_answer_event(self, value):
        for button in self.buttons_list:
            if button.value == value:
                button.set_state("selected")
                self.screen_handler.clear_data()
                self.answer_question_callback(value)
                self.update_screen()

    def show_answer_limit_message(self):
        render_multiline_text(self, "Trop tard!", self.SCREEN_HEIGHT / 2)
        self.update_screen()

    def show_results(self, question):
        for button in self.buttons_list:
            if button.value == question.answers[question.correct_answer]:
                button.set_state("correct")
                self.update_screen()

                selected = button.value
                status = "correct"

            elif button.state == "selected":
                button.set_state("wrong")
                self.update_screen()

                selected = button.value
                status = "wrong"

        self.screen_handler.clear_data()
        return selected, status

    def show_answer_is_wrong(self):
        for button in self.buttons_list:
            if button.state == "selected":
                button.set_state("wrong")
                self.update_screen()
        self.screen_handler.clear_data()

    @flush
    def show_is_blocked(self, *args):
        render_multiline_text(
            self, f"{self.blocking_player} vous a bloqué(e)", self.SCREEN_HEIGHT // 2
        )
