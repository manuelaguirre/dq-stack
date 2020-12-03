import os
import threading
import time
from math import ceil

import pygame
from events.event_handler import EventHandler
from utils.renderer import Renderer, flush
from utils.renderer_utils import render_multiline_text, show_text_at
from utils.screen_button import AnswerScreenButton


class ServerRenderer(Renderer):
    """
    Renderer for the server main app (Central app)
    TODO: Define super class Renderer to share it in the client
    """

    def __init__(self):
        super().__init__(1500, 900, "server")

    @flush
    def show_instructions(self, instrucions):
        """
        Render the instructions
        """
        height_ins = 4 * self.SCREEN_HEIGHT / 6
        height_ins_i = 0.5 * self.SCREEN_HEIGHT / 6
        count = 1
        n = len(instrucions) + 1
        for instruction in instrucions:
            render_multiline_text(
                self, instruction, count * height_ins / n + height_ins_i
            )
            count += 1

    @flush
    def show_available_themes(self, themes):
        """
        Render available themes
        """
        self.show_title("Choisissez 3 thèmes")

        rows = []
        num_rows = ceil(len(themes) / 2)

        # Display rows from 1/3 of the screen until 5/6
        space_for_rows_init = self.SCREEN_HEIGHT / 3
        space_for_rows_total = (5 / 6 - 1 / 3) * self.SCREEN_HEIGHT
        space_for_row = space_for_rows_total / num_rows
        for index in range(num_rows):
            rows.append(space_for_rows_init + space_for_row * index)
        for index in range(len(themes)):
            show_text_at(
                self,
                "medium",
                self.SCREEN_WIDTH * (index % 2 + 1) / 3,
                rows[index // 2],
                themes[index],
            )

    @flush
    def show_chosen_themes(self, chosen_themes):
        self.stop_timer()
        self.show_title("Les themes seront:")
        for i in range(len(chosen_themes)):
            show_text_at(
                self,
                "medium",
                (1 + i) * self.SCREEN_WIDTH / 4,
                self.SCREEN_HEIGHT / 2,
                chosen_themes[i],
            )

    @flush
    def show_upcoming_question_theme(self, theme):
        self.show_title(theme.name)
        show_text_at(
            self,
            "medium",
            self.SCREEN_WIDTH / 2,
            self.SCREEN_HEIGHT / 2,
            theme.description,
        )

    @flush
    def show_question(self, question, index):
        self.show_title(question.theme.name, "medium")
        show_text_at(
            self,
            "small",
            self.SCREEN_WIDTH / 2,
            self.SCREEN_HEIGHT / 4,
            f"QUESTION {index + 1}",
        )
        if question.image_filename:
            image_path = self.get_image_path(os.path.join("images/tmp/" + question.image_filename))
            question_image = pygame.image.load(image_path)

            proportion = (self.SCREEN_HEIGHT / 3) / question_image.get_rect().height
            question_image = pygame.transform.scale(
                question_image,
                (
                    int(proportion * question_image.get_rect().width),
                    self.SCREEN_HEIGHT // 3,
                ),
            )
            question_image_width = question_image.get_rect().width
            question_image_height = question_image.get_rect().height
            self.screen.blit(
                question_image,
                (
                    self.SCREEN_WIDTH // 2 - question_image_width // 2,
                    self.SCREEN_HEIGHT // 2 - question_image_height // 2,
                ),
            )
            render_multiline_text(
                self, question.text, self.SCREEN_HEIGHT * 6 / 8, "medium"
            )
        else:
            render_multiline_text(
                self, question.text, self.SCREEN_HEIGHT * 4 / 8, "medium"
            )

    @flush
    def show_correct_answer(self, question, index):
        self.show_title(question.theme.name, "medium")
        show_text_at(
            self,
            "small",
            self.SCREEN_WIDTH / 2,
            self.SCREEN_HEIGHT / 4,
            f"QUESTION {index + 1}",
        )

        answer_letters = ["A", "B", "C", "D"]
        correct_answer_button = AnswerScreenButton(
            self.SCREEN_WIDTH / 2,
            self.SCREEN_HEIGHT / 2,
            5 * self.SCREEN_WIDTH / 6,
            self.SCREEN_HEIGHT / 8,
            question.answers[question.correct_answer],
            self.button_backgrounds,
            self.screen,
            self.fonts["large"],
        )
        correct_answer_button.set_letter(
            answer_letters[question.correct_answer % len(answer_letters)]
        )
        correct_answer_button.set_state("correct")
