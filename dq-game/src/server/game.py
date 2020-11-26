import random

from events.event_handler import EventHandler
from game_types.round import Round

from mock_data import mock_instructions


class DQGame(EventHandler):
    """
    Main class for a game instance
    """

    def __init__(self, no_of_players):
        self.no_of_players = no_of_players
        self.instructions = mock_instructions  # TODO: Get instructions from API ?
        self.question_pools = []  # TODO: Change to a map
        self.rounds = []

        print("Creating a new game")

    def set_game_question_pools(self, question_pools):
        self.question_pools = question_pools

    def get_available_theme_names(self):
        return list(
            map(lambda question_pool: question_pool.theme.name, self.question_pools)
        )

    def set_rounds(self, themes):
        all_questions = [[], [], []]  # 12 x 3 questions
        for theme in themes:
            for question_pool in self.question_pools:
                if question_pool.theme.name == theme:
                    all_questions[0] += question_pool.questions[0:4]
                    all_questions[1] += question_pool.questions[4:8]
                    all_questions[2] += question_pool.questions[8:12]
        for i in range(3):
            round = Round(i + 1)
            random.shuffle(all_questions[i])
            round.set_questions(all_questions[i])
            self.rounds.append(round)
