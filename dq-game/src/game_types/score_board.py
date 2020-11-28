import sys
import os


class ScoreBoard:
    """
    Class to handle a game round
    """

    def __init__(self):
        self.board = []  # { name: string, diff: number, points: number }

    def add_score(self, name, differential, points):
        self.board.append(
            {
                name: name,
                differential: differential,
                points: points,
            }
        )

    def sort_board(self):
        self.board.sort(key=lambda r: r["points"])
