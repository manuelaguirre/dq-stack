import os
import sys
from config import config


class PointService:
    def __init__(self, round_number):
        if round_number not in (1, 2, 3):
            raise ValueError("Not a valid round number")
        self.round_number = round_number
        self.points_config = config.get("points")

    def calculate_points(self, has_answer, is_correct_answer, rank):
        if self.round_number == 1:
            if has_answer and is_correct_answer:
                return self.points_config["firstRound"]["correct"]

            elif has_answer and not is_correct_answer:
                return self.points_config["firstRound"]["wrong"]

            elif not has_answer:
                return self.points_config["firstRound"]["missing"]

        if self.round_number == 2:
            if has_answer and is_correct_answer:
                return int(
                    self.points_config["secondRound"]["correct"][rank]
                )  # TODO: parser snake case

            elif has_answer and not is_correct_answer:
                return int(self.points_config["secondRound"]["wrong"])

            elif not has_answer:
                return int(self.points_config["secondRound"]["missing"])
