import sys
import os
import requests
import info

class APIHandler:
    #def __init__(self):
        #self.url = url
        #self.credentials = credentials

    def get_questions(self, limit):
        headers = {
            "x-auth-token" : info.X_AUTH_TOKEN
        }        
        r = requests.get(info.BACK_OFFICE_URL + 'questions/', headers=headers)
        return r


