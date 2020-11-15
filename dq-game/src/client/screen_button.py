import sys
import os


class ScreenButton:
    def __init__(self, pos_x, pos_y, width, height, value):
        self.pos = (pos_x, pos_y)
        self.width = width
        self.height = height
        self.value = value
        self.selected = False

    def toggle(self):
        self.selected = not self.selected
