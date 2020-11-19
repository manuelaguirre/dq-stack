import os
import shutil
import sys
import re
import info
import requests
from game_types.question import Question
from game_types.theme import Theme

mock_themes_id = [
    "5f358bafef6f4700178c7b46",
    "5f3197727391ee752d33b6a4",
    "5f33024f6be11a00177f1c92",
]

PATH_TO_TMP_FILES = "src/server/tmp"


class APIHandler:
    # def __init__(self):
    # self.url = url
    # self.credentials = credentials

    def get_available_themes(self):
        headers = {"x-auth-token": info.X_AUTH_TOKEN}
        theme_objects = []
        themes = requests.get(
            info.BACK_OFFICE_URL + "themes",
            headers=headers,
        ).json()
        for theme in themes:
            theme_objects.append(
                Theme(theme["_id"], theme["name"], theme["description"])
            )
        return theme_objects

    def get_questions(self, themes, players):
        headers = {"x-auth-token": info.X_AUTH_TOKEN}
        req_params = {"theme": mock_themes_id, "npb": players}
        question_lists = requests.get(
            info.BACK_OFFICE_URL + "gamequestions", headers=headers, params=req_params
        ).json()
        print(question_lists)
        question_objects_lists = []
        for question_list in question_lists:
            question_objects_list = []
            for question in question_list:
                question_object = Question(
                    question["_id"],
                    question["text"],
                    [
                        question["answer1"],
                        question["answer2"],
                        question["answer3"],
                        question["answer4"],
                    ],
                    question["correct"],
                )
                if "image" in question:
                    question_object.set_image_filename(
                        self.get_question_image(question["_id"])
                    )
                question_objects_list.append(question_object)
            question_objects_lists.append(question_objects_list)
        return question_objects_lists

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
