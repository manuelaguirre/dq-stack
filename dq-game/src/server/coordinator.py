import sys
import os
import time
import config.config as config


class Coordinator:
    def __init__(self, controller, renderer, dq_game, api_handler, players_id):
        self.controller = controller
        self.renderer = renderer
        self.dq_game = dq_game
        self.api_handler = api_handler
        self.players_id = players_id
        self.answer_limits = {
            1: config.get("numberOfPlayers") + 1,  # No limit for first round
            2: 3,
            3: 1,
        }

    def start(self):
        self.game_setup()
        self.game_preparation()
        self.theme_selection_round()
        self.start_first_round()
        self.start_second_round()

    def game_setup(self):
        question_pools = self.api_handler.get_question_pools(self.players_id)
        self.dq_game.set_game_question_pools(question_pools)
        self.controller.await_connections()

    def game_preparation(self):
        self.renderer.show_instructions(self.dq_game.instructions)
        self.controller.send_instructions_and_await_confirmations(
            self.dq_game.instructions
        )
        self.dq_game.initialize_players(self.controller.player_names)

    def theme_selection_round(self):
        available_themes = self.dq_game.get_available_theme_names()
        self.renderer.show_available_themes(available_themes)
        self.renderer.show_timer(
            config.get("themeSelectionTime"), self.controller.timeout
        )

        chosen_themes = self.controller.get_theme_choices(available_themes)
        self.dq_game.set_rounds(chosen_themes)
        self.renderer.show_chosen_themes(chosen_themes)
        time.sleep(5)

    def start_first_round(self):
        self.renderer.show_round_instructions(self.dq_game.rounds[0].instructions)
        self.controller.start_round(1)
        time.sleep(5)

        for index, question in enumerate(self.dq_game.rounds[0].questions):
            # Send upcoming question
            self.controller.send_upcoming_question_with_jokers(
                question, self.dq_game.players
            )
            # Show theme with joker
            self.renderer.show_upcoming_question_theme(question.theme)
            self.renderer.show_timer(
                config.get("jokerSelectionTime"), self.controller.timeout
            )
            self.controller.show_upcoming_question_theme()
            # Show question

            self.ask_question(
                question,
                index,
                answer_limit_callback=self.answer_limit_callback,
                answer_limit=100,  # TODO CHANGE THIS
            )
            time.sleep(5)
            # Show scores
            score_board = self.dq_game.get_score_board()
            self.controller.show_scores(score_board)
            self.renderer.show_scores(score_board)
            time.sleep(5)

    def start_second_round(self):
        self.renderer.show_round_instructions(self.dq_game.rounds[1].instructions)
        self.controller.start_round(2)
        time.sleep(5)

        for index, question in enumerate(self.dq_game.rounds[1].questions):
            # Send upcoming question
            self.controller.send_upcoming_question_with_jokers(
                question, self.dq_game.players
            )
            # Show theme with joker
            self.renderer.show_upcoming_question_theme(question.theme)
            self.renderer.show_timer(
                config.get("jokerSelectionTime"), self.controller.timeout
            )
            self.controller.show_upcoming_question_theme()
            # Show question

            self.ask_question(
                question,
                index,
                answer_limit_callback=self.answer_limit_callback,
                answer_limit=3,
            )
            time.sleep(5)
            # Show scores
            score_board = self.dq_game.get_score_board()
            self.controller.show_scores(score_board)
            self.renderer.show_scores(score_board)
            time.sleep(5)

    def answer_limit_callback(self):
        self.renderer.stop_timer()
        self.controller.answer_limit_reached()

    def ask_question(
        self,
        question,
        index,
        answer_limit_callback,
        answer_limit=config.get("numberOfPlayers"),
    ):
        def resolve_question():
            self.controller.resolve_question()
            self.renderer.show_correct_answer(question, index)
            self.dq_game.update_jokers(self.controller.current_played_jokers)
            self.dq_game.receive_answers(
                self.controller.current_answers,
                question,
                self.controller.current_played_jokers,
            )

        def answer_limit_callback_and_resolve():  # append resolve question method to this callback
            answer_limit_callback()
            resolve_question()

        self.renderer.show_question(question, index)
        self.renderer.show_timer(
            config.get("questionOptions.questionTime"), resolve_question
        )

        self.controller.ask_question(
            question, answer_limit, answer_limit_callback_and_resolve
        )
