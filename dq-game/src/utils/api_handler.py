import os
import re
import shutil
import sys

import info
import requests
from game_types.player import Player
from game_types.question_pool import QuestionPool

PATH_TO_TMP_FILES = "src/server/tmp"


class APIHandler:
    def get_game(self):
        """
        Returns players and question pools from a game given by the service
        """
        headers = {"x-auth-token": info.X_AUTH_TOKEN}
        response = requests.get(info.BACK_OFFICE_URL + "games", headers=headers).json()[
            0
        ]  # Get only first game from db
        print(response)
        question_pools = []
        for question_pool in response["questionPools"]:
            print(question_pool)
            for question in question_pool["questions"]:
                if "image" in question:
                    question["image_filename"] = self.get_question_image(
                        question["_id"]
                    )
            question_pools.append(
                QuestionPool(question_pool["theme"], question_pool["questions"])
            )

        players = []
        for player in response["players"]:
            players.append(Player(player["firstName"], player["_id"]))

        return players, question_pools

    def get_question_image(self, question_id):
        headers = {"x-auth-token": info.X_AUTH_TOKEN}
        image = requests.get(
            info.BACK_OFFICE_URL + "questions/" + question_id + "/image",
            headers=headers,
            stream=True,
        )
        file_extension = "." + re.search(
            "(?<=image/).*", image.headers["content-type"]
        ).group(0)
        file_name = f"{question_id}" + file_extension
        full_path = PATH_TO_TMP_FILES + "/" + file_name
        with open(full_path, "wb") as f:
            for chunk in image:
                f.write(chunk)
            f.close()
        return file_name
