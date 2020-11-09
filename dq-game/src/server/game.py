from events.event_handler import EventHandler


class DQGame(EventHandler):
    """
    Main class for a game instance
    """

    def __init__(self, theme_list):
        self.theme_list = theme_list
        print("Creating a new game")

    def start(self):
        self.trigger("REQUEST_CHOOSE_THEMES", self.theme_list)

    def show_instructions(self):
        self.trigger("SHOW_INSTRUCTIONS")
