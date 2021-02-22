import sys
import os


class ScoreBoard:
    """
    Class to handle a game round
    """

    def __init__(self):
        self.board = []  # { name: string, diff: number, points: number }
        self.played_jokers = {}  # { [name: string]: { value: string, target: string } }
        self.player_answer_results = {}

    def add_played_jokers(self, jokers):
        self.played_jokers = jokers

    def add_player_answer_results(self, answer_results):
        self.player_answer_results = answer_results

    def add_score(self, name, differential, points):
        result_icon = {"__image": "NONE"}
        if self.player_answer_results[name]["has_answer"]:
            if self.player_answer_results[name]["is_correct_answer"]:
                result_icon = {"__image": "CORRECT"}
            else:
                result_icon = {"__image": "WRONG"}

        self.board.append([result_icon, name, points, differential])

    def get_board_with_jokers(self):
        """
        Create the a score board with the joker actions
        """
        result = []

        for row in self.board:
            joker = {"__image": "NONE"}
            action = ""
            # Check if player used a joker
            if row[1] in self.played_jokers:
                played_joker = self.played_jokers[row[1]]
                played_joker_type = played_joker["value"]
                joker = {"__image": played_joker_type}
                if played_joker["target"] != None:
                    action = played_joker["target"]
            result.append([row[0], row[1], joker, action])
        return result

    def stringify_board(self, board):
        """
        Stringifies all items in board lists
        """
        result = []

        for row in board:
            signed_differential = str(row[3])
            if row[3] >= 0:
                signed_differential = f"+{row[3]}"

            result.append([row[0], row[1], str(row[2]), signed_differential])
        return result

    def sort_board(self):
        self.board.sort(key=lambda r: r[2], reverse=True)

    def get_points_transition(self):
        # get abs value of max diff
        max_diff = abs(max(self.board, key=lambda r: abs(r[3]))[3])
        for i in range(max_diff):
            yield self.stringify_board(self.board)
            for row in self.board:
                if row[3] > 0:
                    row[3] -= 1
                    row[2] += 1
                elif row[3] < 0:
                    row[3] += 1
                    row[2] -= 1
        yield self.stringify_board(self.board)

        # Bubble sort

    def get_sort_transition(self):
        n = len(self.board)
        # Traverse through all array elements
        for i in range(n - 1):
            # range(n) also work but outer loop will repeat one time more than needed.
            # Last i elements are already in place
            for j in range(0, n - i - 1):
                # traverse the array from 0 to n-i-1
                # Swap if the element found is greater
                # than the next element
                if self.board[j][2] < self.board[j + 1][2]:
                    self.board[j], self.board[j + 1] = self.board[j + 1], self.board[j]
                    yield self.stringify_board(self.board)
