import sys
import os


class ScoreBoard:
    """
    Class to handle a game round
    """

    def __init__(self):
        self.board = []  # { name: string, diff: number, points: number }

    def add_score(self, name, differential, points):

        self.board.append([name, points, differential])

    def stringify_board(self, board):
        """
        Stringifies all items in board lists
        """
        result = []

        for row in board:
            signed_differential = str(row[2])
            if row[2] >= 0:
                signed_differential = f"+{row[2]}"

            result.append([row[0], str(row[1]), signed_differential])
        return result

    def sort_board(self):
        self.board.sort(key=lambda r: r[1], reverse=True)

    def get_points_transition(self):
        # get abs value of max diff
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
        
        # Bubble sort
    def get_sort_transition(self):    
        n = len(self.board) 
        # Traverse through all array elements 
        for i in range(n-1): 
        # range(n) also work but outer loop will repeat one time more than needed. 
            # Last i elements are already in place 
            for j in range(0, n-i-1): 
                # traverse the array from 0 to n-i-1 
                # Swap if the element found is greater 
                # than the next element 
                if self.board[j][1] < self.board[j+1][1] : 
                    self.board[j], self.board[j+1] = self.board[j+1], self.board[j]
                    yield self.stringify_board(self.board)

