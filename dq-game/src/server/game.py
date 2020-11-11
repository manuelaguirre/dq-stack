from events.event_handler import EventHandler


class DQGame(EventHandler):
    """
    Main class for a game instance
    """

    def __init__(self, theme_list):
        self.theme_list = theme_list
        print("Creating a new game")
