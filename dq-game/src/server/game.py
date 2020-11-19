from events.event_handler import EventHandler
from mock_data import mock_instructions


class DQGame(EventHandler):
    """
    Main class for a game instance
    """

    def __init__(self, no_of_players):
        self.no_of_players = no_of_players
        self.instructions = mock_instructions  # TODO: Get instructions from API ?
        self.game_questions = {
            "first_round": [],
            "second_round": [],
            "third_round": [],
        }
        print("Creating a new game")

    def receive_game_questions(self, questions):
        self.game_questions["first_round"] = questions[0]
        self.game_questions["second_round"] = questions[1]
        self.game_questions["third_round"] = questions[2]
        print("Questions received")
