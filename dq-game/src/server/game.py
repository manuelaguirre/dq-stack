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
        self.question_pools = [] # TODO: Change to a map
        self.rounds = []

        print("Creating a new game")

    def set_game_question_pools(self, question_pools):
        self.question_pools = question_pools

    def get_available_theme_names(self):
        return list(
            map(lambda question_pool: question_pool.theme.name, self.question_pools)
        )

    def set_rounds(self, themes):
        for theme in themes:
            for question_pool in self.question_pools:
                if question_pool.theme.name == theme:
                    round = Round(question_pool.theme)
                    round.set_questions(question_pool.questions)
                    self.rounds.append(round)
