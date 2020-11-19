from events.event_handler import EventHandler
from mock_data import mock_instructions


class DQGame(EventHandler):
    """
    Main class for a game instance
    """

    def __init__(self, no_of_players):
        self.no_of_players = no_of_players
        self.instructions = mock_instructions  # TODO: Get instructions from API ?
        self.available_themes = []
        self.chosen_themes = []
        self.game_questions = {
            "first_round": [],
            "second_round": [],
            "third_round": [],
        }
        print("Creating a new game")

    def set_available_themes(self, themes):
        self.available_themes = themes
        print("Themes received")

    def get_available_theme_names(self):
        return list(map(lambda theme: theme.name, self.available_themes))

    def set_chosen_themes(self, themes):
        self.chosen_themes = themes
        print("Chosen themes received")

    def set_game_questions(self, questions):
        self.game_questions["first_round"] = questions[0]
        self.game_questions["second_round"] = questions[1]
        self.game_questions["third_round"] = questions[2]
        print("Questions received")
