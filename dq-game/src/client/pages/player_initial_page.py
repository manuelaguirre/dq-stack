from client.pages.page_interface import Page
from utils.screen_button import ThemeScreenButton
from utils.renderer_utils import show_text_at


class PlayerInitialPage(Page):
    def __init__(self, renderer, screen_handler):
        self.renderer = renderer
        self.screen_handler = screen_handler
        self.actual_player = None
        self.callback = None

    def render(self):
        self.renderer.show_background()
        self.renderer.buttons_list = []
        self.screen_handler.clear_data()

        self._show_title()

        show_text_at(
            self.renderer,
            "large",
            self.renderer.SCREEN_WIDTH / 2,
            2 * self.renderer.SCREEN_HEIGHT / 5,
            self.actual_player,
        )

        ready_button = ThemeScreenButton(
            self.renderer.SCREEN_WIDTH / 2,
            4 * self.renderer.SCREEN_HEIGHT / 5,
            self.renderer.THEME_BUTTON_WIDTH,
            self.renderer.THEME_BUTTON_HEIGHT,
            "SUIVANT",
            self.renderer.button_backgrounds,
            self.renderer.screen,
            self.renderer.fonts["small"],
        )
        self.screen_handler.add_object(ready_button)
        ready_button.display()
        self.screen_handler.add_touch_callback(self.finish)

        self.renderer.update_screen()

    def set_data(self, data):
        self.actual_player = data

    def set_callback(self, callback):
        self.callback = callback

    def finish(self, value):
        if value:
            self.screen_handler.clear_data()
            self.callback()

    def _show_title(self):
        self.renderer.show_title("Bienvenue")
