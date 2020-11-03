import sys
import os


class Message:
    def __init__(self, origin, data, content_type):
        self.origin = origin
        self.content_type = content_type
        self.data = data
