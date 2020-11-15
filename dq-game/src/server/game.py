from events.event_handler import EventHandler
from mock_data import mock_instructions


class DQGame(EventHandler):
    """
    Main class for a game instance
    """

    def __init__(self, no_of_players):
        self.no_of_players = no_of_players
        self.instructions = mock_instructions  # TODO: Get instructions from API ?
        print("Creating a new game")
