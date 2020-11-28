import sys
import os


class ScoreBoard:
    """
    Class to handle a game round
    """

    def __init__(self):
        self.board = []  # { name: string, diff: number, points: number }

    def add_score(self, name, differential, points):

        self.board.append([
            name,
            points,
            differential
        ])

    def stringify_board(self, board):
        """
        Stringifies all items in board lists
        """
        result = []

        for row in board:            
            signed_differential = str(row[2])
            if row[2] >= 0:
                signed_differential = f"+{row[2]}"

            result.append([
                row[0],
                str(row[1]),
                signed_differential
            ])
        return result

    def sort_board(self):
        self.board.sort(key=lambda r: r[1], reverse=True)

    def get_score_board_transition(self):
        #get abs value of max diff
        max_diff = abs(max(self.board, key=lambda r: abs(r[2]))[2])
        for i in range(max_diff):
            yield self.stringify_board(self.board)
            for row in self.board:
                if row[2] > 0:
                    row[2] -= 1
                    row[1] += 1
                elif row[2] < 0:
                    row[2] += 1
                    row[1] -= 1    
        yield self.stringify_board(self.board)        
                                
