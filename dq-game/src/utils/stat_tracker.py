import os
import json


class StatTracker:
    def __init__(self, game_id):
        self.game_id = game_id
        self.question_log = {}
        self.file_path = self.set_file_path()

    def set_players(self, players):
        self.player_ids = self.set_player_ids(players)

    def add_question_log(self, _id):
        self.question_log["question"] = _id
        self.question_log["answers"] = []

    def log_answer(
        self, player_name, has_answer, is_correct, differential, stolen_points
    ):
        self.question_log["answers"].append(
            {
                "player": self.player_ids[player_name],
                "correct": is_correct,
                "hadAnswered": has_answer,
                "points": differential,
                "stolenPoints": stolen_points,
            }
        )

    def log_jokers(self, jokers):
        self.question_log["jokers"] = [
            {
                "player": self.player_ids[player],
                "value": jokers[player]["value"],
                "target": self.player_ids[jokers[player]["target"]]
                if jokers[player]["target"]
                else None,
            }
            for player in jokers
        ]

    def set_player_ids(self, players):
        return {player.name: player._id for player in players}

    def write_to_file(self, round_number):
        try:
            with open(self.file_path) as file:
                data = json.load(file)
        except IOError:
            print("Error reading stats file")

        try:
            if round_number == 1:
                data["firstRound"].append(self.question_log)
            elif round_number == 2:
                data["secondRound"].append(self.question_log)
            elif round_number == 3:
                data["thirdRound"].append(self.question_log)
        except AttributeError:
            print("error writing stats file")

        with open(self.file_path, "w") as file:
            json.dump(data, file)

    def write_final_results(self, players):
        try:
            with open(self.file_path) as file:
                data = json.load(file)
        except IOError:
            print("Error reading stats file")

        data["finalResults"] = [
            {"player": player._id, "points": player.points} for player in players
        ]

        with open(self.file_path, "w") as file:
            json.dump(data, file)

    def set_file_path(self):
        base_path = os.path.dirname(__file__)
        file_path = os.path.join("stats/" + "stats" + self.game_id + ".json")
        file_path = os.path.abspath(os.path.join(base_path, "..", file_path))
        with open(file_path, "w+") as file:
            json.dump(
                {
                    "firstRound": [],
                    "secondRound": [],
                    "thirdRound": [],
                    "finalResults": [],
                },
                file,
            )
        return file_path

    def get_stats(self):
        try:
            with open(self.file_path) as file:
                return json.load(file)

        except IOError:
            print("Error reading stats file")
