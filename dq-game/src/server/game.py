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
        self.question_pools = []
        self.rounds = []

        print("Creating a new game")

    def set_game_question_pools(self, question_pools):
        self.question_pools = question_pools

    def get_available_theme_names(self):
        return list(
            map(lambda question_pool: question_pool.theme.name, self.question_pools)
        )

    def set_round_themes(self, themes):
        for theme in themes:
            self.rounds.append(Round(self.get_theme_by_name(theme)))
        print("Chosen themes received")

    def get_theme_by_name(self, name):
        for question_pool in self.question_pools:
            if question_pool.theme.name == name:
                return question_pool.theme
        raise RuntimeError("No theme corresponds to this name")
