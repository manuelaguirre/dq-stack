import sys
import os
from utils.renderer import Renderer
import threading
import math
import time
from screen_button import ScreenButton
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
        self.THEME_BUTTON_WIDTH = 230
        self.THEME_BUTTON_HEIGHT = 40
        self.selected_themes_num = 0
        self.selected_themes = []
        self.theme_validation_button = None
        self.validate_themes_callback = None


    def show_ready_button(self, callback): #TODO 4043: Ready callback while showing instructions
        callback()

    def select_themes(self, themes, callback):
        self.themes = themes
        self.validate_themes_callback = callback
        self.append_touch_method(self.screen_handler.handle_touch)
        threading.Thread(target=self._select_themes).start()

    def _select_themes(self):
        """
        Calculate rows and columns. Create buttons and display them with the screen handler
        """
        print(self.themes)
        time.sleep(1)
        # Create columns and rows
        columns = [4 * self.SCREEN_WIDTH / 11, 7 * self.SCREEN_WIDTH / 11]
        num_rows = math.ceil(len(self.themes) / 2)
        rows = []
        for index in range(num_rows):
            rows.append(
                3 / 9 * self.SCREEN_HEIGHT
                + 5 / 9 * self.SCREEN_HEIGHT / (2 * num_rows + 1) * (2 * index + 1)
            )
        # Create one button per theme
        for index in range(len(self.themes)):
            pos_x = columns[index % 2]
            pos_y = rows[math.floor(index / 2)]
            button = ScreenButton(pos_x, pos_y, self.themes[index])
            self.buttons_list.append(button)
            self.screen_handler.add_object(
                {
                    "init": (
                        pos_x - self.THEME_BUTTON_WIDTH / 2,
                        pos_y - self.THEME_BUTTON_HEIGHT / 2,
                    ),
                    "end": (
                        pos_x + self.THEME_BUTTON_WIDTH / 2,
                        pos_y + self.THEME_BUTTON_HEIGHT / 2,
                    ),
                    "value": self.themes[index],
                }
            )
        # Create validate button
        pos_x_validate = self.SCREEN_WIDTH / 2
        pos_y_validate = 8 / 9 * self.SCREEN_HEIGHT
        self.theme_validation_button = ScreenButton(pos_x_validate, pos_y_validate, "Select")
        self.buttons_list.append(self.theme_validation_button)
        self.screen_handler.add_object(
            {
                "init": (
                    pos_x_validate - self.THEME_BUTTON_WIDTH / 2,
                    pos_y_validate - self.THEME_BUTTON_HEIGHT / 2,
                ),
                "end": (
                    pos_x_validate + self.THEME_BUTTON_WIDTH / 2,
                    pos_y_validate + self.THEME_BUTTON_HEIGHT / 2,
                ),
                "value": self.theme_validation_button.value,
            }
        )
        # Attach callback method for touch event
        self.screen_handler.add_touch_callback(self.select_theme_event)
        # Display
        self.display_themes_buttons()

    def display_themes_buttons(self):
        self.show_background()
        # Show title
        text_ = self.font.render("Select 3 themes", True, (0, 0, 0))
        text_rect = text_.get_rect(
            center=(self.SCREEN_WIDTH / 2, 1 / 9 * self.SCREEN_HEIGHT)
        )
        self.screen.blit(text_, text_rect)
        # Display all buttons
        for button in self.buttons_list:
            self.display_from_button(button)
        self.update_screen()

    def display_from_button(self, button):
        # Display/re-display one button
        self.display_button(
            button.value,
            button.pos_x,
            button.pos_y,
            self.THEME_BUTTON_WIDTH,
            self.THEME_BUTTON_HEIGHT,
            button.selected,
        )

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
                    self.display_from_button(button)
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
                        self.display_from_button(self.theme_validation_button)
                    else:
                        self.theme_validation_button.selected = False
                        self.display_from_button(self.theme_validation_button)
                    self.update_screen()
                    break

    def themes_selected_done(self):
        print(self.selected_themes)
        self.screen_handler.clear_data()
        self.validate_themes_callback(self.selected_themes)
        self.show_logo()
