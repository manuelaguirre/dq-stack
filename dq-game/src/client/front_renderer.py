import os
import sys
from utils.renderer import Renderer


class FrontRenderer(Renderer):
    def __init__(self):
        super().__init__(400, 400, "client")
    def receive_instruction(self, instruction, arg=None):
        if instruction == "show_logo":
            self.show_logo()
        if instruction == "clear_data":
            self.screen_handler.clear_data()
        if instruction == "show_answer_limit_message":
            self.screen_handler.show_answer_limit_message()
        if instruction == "set_username":
            self.username = arg
        if instruction == "set_player_name_list":
            self.player_name_list = arg
            self.player_name_list.remove(self.username)
