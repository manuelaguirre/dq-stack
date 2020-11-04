import sys
import os


class ScreenButton:
    def __init__(self, pos_x, pos_y, value):
        self.pos_x = pos_x
        self.pos_y = pos_y
        self.value = value
        self.selected = False

    def toggle(self):
        self.selected = not self.selected
