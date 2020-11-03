from events.event_handler import EventHandler


class DQClientGame(EventHandler):
    """
    Main class for a game instance
    """

    def __init__(self):
        print("Creating a new client game")

    def start(self):
        self.trigger("CHOOSE_THEMES")
