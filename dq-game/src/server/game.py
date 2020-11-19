from events.event_handler import EventHandler
from mock_data import mock_instructions
from game_types.round import Round


class DQGame(EventHandler):
    """
    Main class for a game instance
    """

    def __init__(self, no_of_players):
        self.no_of_players = no_of_players
        self.instructions = mock_instructions  # TODO: Get instructions from API ?
        self.available_themes = []
        self.rounds = []
            
        print("Creating a new game")

    def set_available_themes(self, themes):
        self.available_themes = themes
        print("Themes received")

    def get_available_theme_names(self):
        return list(map(lambda theme: theme.name, self.available_themes))

    def set_round_themes(self, themes):
        for theme in themes:
            self.rounds.append(Round(self.get_theme_by_name(theme)))  
        print("Chosen themes received")

    def get_theme_by_name(self, name):
        for theme in self.available_themes:
            if theme.name == name:
                return theme
        raise RuntimeError("No theme corresponds to this name")

    def set_game_questions(self, questions_lists):
        for i in range(len(self.rounds)):
            self.rounds[i].set_questions(questions_lists[i])
        print("Questions received")
