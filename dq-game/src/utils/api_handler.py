import os
import shutil
import sys
import re
import info
import requests
from game_types.question import Question
from game_types.theme import Theme
from game_types.question_pool import QuestionPool

PATH_TO_TMP_FILES = "src/server/tmp"


class APIHandler:
    # def __init__(self):
    # self.url = url
    # self.credentials = credentials

    def get_question_pools(self, players):
        headers = {"x-auth-token": info.X_AUTH_TOKEN}
        req_params = {"npb": players}
        response = requests.get(
            info.BACK_OFFICE_URL + "questionpools", headers=headers, params=req_params
        ).json()
        print(response)
        question_pools = []
        for question_pool in response:
            print(question_pool)
            for question in question_pool["questions"]:
                if "image" in question:
                    question["image_filename"] = self.get_question_image(
                        question["_id"]
                    )
            question_pools.append(
                QuestionPool(question_pool["theme"], question_pool["questions"])
            )
        return question_pools

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
