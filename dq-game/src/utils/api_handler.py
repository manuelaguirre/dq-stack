import sys
import os
import requests
import info

mock_themes_id = [
    "5f3197727391ee752d33b6a4",
    "5f358bafef6f4700178c7b46",
    "5f33024f6be11a00177f1c92",
]


class APIHandler:
    # def __init__(self):
    # self.url = url
    # self.credentials = credentials

    def get_questions(self, themes, players):
        headers = {"x-auth-token": info.X_AUTH_TOKEN}
        req_params = {"theme": mock_themes_id, "npb": players}
        question_lists = requests.get(
            info.BACK_OFFICE_URL + "gamequestions", headers=headers, params=req_params
        ).json()
        print(question_lists)
        for question_list in question_lists:
            for question in question_list:
                print(question)
                if "image" in question:
                    question["imageFile"] = self.get_question_image(question["_id"])
        return question_lists

    def get_question_image(self, question_id):
        headers = {"x-auth-token": info.X_AUTH_TOKEN}
        image = requests.get(
            info.BACK_OFFICE_URL + 'questions/' + question_id + "/image", headers=headers
        )
        print(image)
        return image
