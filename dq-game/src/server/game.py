import random

from events.event_handler import EventHandler
from game_types.round import Round
from game_types.player import Player
from game_types.score_board import ScoreBoard

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
        self.players = []

        print("Creating a new game")

    def initialize_players(self, player_names):
        for player_name in player_names:
            self.players.append(Player(player_name))

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

    def receive_answers(self, player_answers, question):
        for player in self.players:
            has_answer = False
            for player_answer in player_answers:
                if player.name == player_answer.player_name:
                    has_answer = True
                    if (
                        player_answer.answer
                        == question.answers[question.correct_answer]
                    ):
                        player.add_points(3)
                    else:
                        player.add_points(-1)
            if not has_answer:
                player.add_points(0)

    def get_score_board(self):
        score_board = ScoreBoard()
        for player in self.players:
            score_board.add_score(
                player.name, player.differential, player.points - player.differential
            )
        score_board.sort_board()
        print(score_board.__repr__())
        return score_board

    def find_player_by_name(self, name):
        for player in self.players:
            if player.name == name:
                return player
        raise RuntimeError("No player with this name")
