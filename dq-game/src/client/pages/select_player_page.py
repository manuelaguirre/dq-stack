from client.pages.page_interface import Page


class SelectPlayerPage(Page):
    def __init__(self, renderer, screen_handler):
        self.renderer = renderer
        self.screen_handler = screen_handler
        self.player_list = []
        self.callback = None

    def render(self):
        self.renderer.show_background()
        self.renderer.buttons_list = []
        self.screen_handler.clear_data()
        self.renderer.create_buttons(self.player_list, "Themes")
        self.screen_handler.add_touch_callback(self.callback)

        self._show_title()
        self.renderer.display_buttons()
        self.renderer.update_screen()

    def set_data(self, data):
        self.player_list = data

    def set_callback(self, callback):
        def callback_and_finish(target):
            callback(target)
            self.finish()

        self.callback = callback_and_finish

    def finish(self):
        self.renderer.show_background()
        self.screen_handler.clear_data()

    def _show_title(self):
        self.renderer.show_title("Choisissez une cible")
