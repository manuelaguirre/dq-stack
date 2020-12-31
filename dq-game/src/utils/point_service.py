import os
import sys
from config import config


class PointService:
    def __init__(self, round_number):
        if round_number not in (1, 2, 3):
            raise ValueError("Not a valid round number")
        self.round_number = round_number
        self.points_config = config.get("points")

    def calculate_points(self, has_answer, is_correct_answer, answer_order):
        if self.round_number == 1:
            if has_answer and is_correct_answer:
                return int(self.points_config["firstRound"]["correct"])

            elif has_answer and not is_correct_answer:
                return int(self.points_config["firstRound"]["wrong"])

            elif not has_answer:
                return int(self.points_config["firstRound"]["missing"])

        if self.round_number == 2:
            if has_answer and is_correct_answer:
                return int(
                    self.points_config["secondRound"]["correct"][answer_order]
                )  # TODO: parser snake case

            elif has_answer and not is_correct_answer:
                return int(self.points_config["secondRound"]["wrong"])

            elif not has_answer:
                return int(self.points_config["secondRound"]["missing"])

        if self.round_number == 3:
            if has_answer and is_correct_answer:
                return int(
                    self.points_config["thirdRound"]["correct"]
                )  # TODO: parser snake case

            elif has_answer and not is_correct_answer:
                return int(self.points_config["thirdRound"]["wrong"])

            elif not has_answer:
                return int(self.points_config["thirdRound"]["missing"])
