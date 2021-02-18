import random
from collections import defaultdict

from events.event_handler import EventHandler
from game_types.round import Round
from game_types.player import Player
from game_types.score_board import ScoreBoard
from utils.point_service import PointService
from utils.stat_tracker import StatTracker

from mock_data import mock_instructions


class DQGame(EventHandler):
    """
    Main class for a game instance
    """

    def __init__(self):
        self.instructions = mock_instructions  # TODO: Get instructions from API ?
        self.game_id = None
        self.question_pools = []  # TODO: Change to a map
        self.rounds = []
        self.players = []
        self.round_number = 0

        print("Creating a new game")

    def initialize_players(self, players):
        for player in players:
            self.players.append(player)

    def set_game_id(self, game_id):
        self.game_id = game_id

    def set_game_question_pools(self, question_pools):
        self.question_pools = question_pools

    def create_stat_tracker(self):
        self.stat_tracker = StatTracker(self.game_id, self.players)

    def get_available_theme_names(self):
        return list(
            map(lambda question_pool: question_pool.theme.name, self.question_pools)
        )

    def set_round_number(self, number):
        self.round_number = number

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

    def receive_answers(self, player_answers, question, jokers):
        """
        Updates Game Model with question results and logs it on the stat tracker
        """

        point_service = PointService(self.round_number)

        self.stat_tracker.add_question_log(question._id)

        self._reset_player_stolen_points()
        steals = defaultdict(list)
        for player, joker in jokers.items():
            if joker["value"] == "STEAL":
                stolen_player_name = joker["target"]
                stealing_player = self.find_player_by_name(player)
                steals[stolen_player_name].append(stealing_player)

        for player in self.players:
            has_answer, is_correct_answer, answer_order = self.check_answer(
                player, player_answers, question
            )

            points = point_service.calculate_points(
                has_answer, is_correct_answer, answer_order
            )

            player.add_points(points)

            is_double = False

            try:
                is_double = jokers[player.name]["value"] == "DOUBLE"
            except KeyError:
                pass

            if is_double:
                player.double_differential()

            has_been_stolen = False
            for thief in steals[player.name]:
                thief.add_stolen_points(player.differential)
                has_been_stolen = True

            if has_been_stolen:
                player.undo_points()

            self.stat_tracker.log_answer(
                player.name,
                has_answer,
                is_correct_answer,
                player.differential,
                player.stolen_points,
            )

        self.stat_tracker.log_jokers(jokers)
        self.stat_tracker.write_to_file(self.round_number)

    def check_answer(self, player, player_answers, question):

        has_answer = False
        is_correct_answer = False
        answer_order = None
        player_answer = None

        for index, player_answer in enumerate(player_answers):
            if player.name == player_answer.player_name:
                has_answer = True
                is_correct_answer = (
                    player_answer.answer == question.answers[question.correct_answer]
                )
                answer_order = index

        return has_answer, is_correct_answer, answer_order

    def unblock_players(self):
        for player in self.players:
            player.blocked_by = None

    def consume_jokers(self, played_jokers):
        for player in self.players:
            played_joker_type = None
            try:
                played_joker_type = played_jokers[player.name]["value"]
            except KeyError:
                pass
            player.consume_joker(played_joker_type)

    def add_jokers(self, jokers_map):
        for player_name, jokers in jokers_map.items():
            player = self.find_player_by_name(player_name)
            player.add_jokers(jokers)

    def get_score_board(self):
        score_board = ScoreBoard()
        for player in self.players:
            score_board.add_score(
                player.name,
                player.differential + player.stolen_points,
                player.points - player.differential - player.stolen_points,
            )
        score_board.sort_board()
        print(score_board.__repr__())
        return score_board

    def get_player_names(self):
        return [player.name for player in self.players]

    def find_player_by_name(self, name):
        for player in self.players:
            if player.name == name:
                return player
        raise RuntimeError("No player with this name")

    def _reset_player_stolen_points(self):
        for player in self.players:
            player.stolen_points = 0

    def end(self):
        self.stat_tracker.write_final_results(self.players)

    def get_stats(self):
        return self.stat_tracker.get_stats()
