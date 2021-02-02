import sys
import os
import time
import config.config as config


class Coordinator:
    def __init__(self, controller, renderer, dq_game, api_handler):
        self.controller = controller
        self.renderer = renderer
        self.dq_game = dq_game
        self.api_handler = api_handler
        self.players = []
        self.answer_limits = {
            1: None,
            2: config.get("answerLimits.secondRound"),
            3: config.get("answerLimits.thirdRound"),
        }

    def start(self):
        self.game_setup()
        self.game_preparation()
        self.theme_selection_round()
        self.start_first_round()
        self.start_second_round()
        self.start_joker_lottery()
        self.start_third_round()

    def game_setup(self):
        self.players, question_pools = self.api_handler.get_game()
        self.dq_game.set_game_question_pools(question_pools)
        self.dq_game.initialize_players(self.players)

        self.controller.set_number_of_players(len(self.players))
        self.controller.await_connections()
        self.controller.distribute_usernames(self.players)
        self.controller.send_player_name_list(self.players)

    def game_preparation(self):
        self.renderer.show_instructions(self.dq_game.instructions)
        self.controller.send_instructions_and_await_confirmations(
            self.dq_game.instructions
        )

    def theme_selection_round(self):
        available_themes = self.dq_game.get_available_theme_names()
        self.renderer.show_available_themes(available_themes)
        self.renderer.show_timer(
            config.get("themeSelectionTime"), self.controller.emit_timeout
        )

        chosen_themes = self.controller.get_theme_choices(available_themes)
        self.dq_game.set_rounds(chosen_themes)
        self.renderer.show_chosen_themes(chosen_themes)
        time.sleep(5)

    def start_first_round(self):
        self.round_start_up(1)
        time.sleep(5)

        for index, question in enumerate(self.dq_game.rounds[0].questions):
            # Trigger lottery during the round
            if index == 4:
                self.start_joker_lottery()

            # Send upcoming question
            self.controller.send_upcoming_question_with_jokers(
                question, self.dq_game.players
            )
            # Show theme with joker
            self.renderer.show_upcoming_question_theme(question.theme)
            self.renderer.show_timer(
                config.get("jokerSelectionTime"), self.controller.emit_timeout
            )
            self.controller.show_upcoming_question_theme()
            self.controller.handle_blocked_players(self.dq_game.players)

            # Show question

            self.ask_question(
                question,
                index,
                answer_limit=len(self.players) + 1,  # No limit for first question
            )
            time.sleep(5)
            # Show scores
            score_board = self.dq_game.get_score_board()
            self.controller.show_scores(score_board)
            self.renderer.show_scores(score_board)
            time.sleep(5)

    def start_second_round(self):
        self.round_start_up(2)
        time.sleep(5)

        for index, question in enumerate(self.dq_game.rounds[1].questions):
            # Trigger lottery during the round
            if index == 4:
                self.start_joker_lottery()

            # Send upcoming question
            self.controller.send_upcoming_question_with_jokers(
                question, self.dq_game.players
            )
            # Show theme with joker
            self.renderer.show_upcoming_question_theme(question.theme)
            self.renderer.show_timer(
                config.get("jokerSelectionTime"), self.controller.emit_timeout
            )
            self.controller.show_upcoming_question_theme()
            self.controller.handle_blocked_players(self.dq_game.players)

            # Show question

            self.ask_question(
                question,
                index,
                answer_limit=self.answer_limits[2],
            )
            time.sleep(5)
            # Show scores
            score_board = self.dq_game.get_score_board()
            self.controller.show_scores(score_board)
            self.renderer.show_scores(score_board)
            time.sleep(5)

    def start_third_round(self):
        self.round_start_up(3)
        time.sleep(5)

        for index, question in enumerate(self.dq_game.rounds[2].questions):
            # Trigger lottery during the round
            if index == 4:
                self.start_joker_lottery()

            # Send upcoming question
            self.controller.send_upcoming_question_with_jokers(
                question, self.dq_game.players
            )
            # Show theme with joker
            self.renderer.show_upcoming_question_theme(question.theme)
            self.renderer.show_timer(
                config.get("jokerSelectionTime"), self.controller.emit_timeout
            )
            self.controller.show_upcoming_question_theme()
            self.controller.handle_blocked_players(self.dq_game.players)
            # Show question and repeat in case of wrong answer
            self.ask_question(
                question,
                index,
                answer_limit=self.answer_limits[3],
                repeat=True,
            )
            time.sleep(5)
            # Show scores
            score_board = self.dq_game.get_score_board()
            self.controller.show_scores(score_board)
            self.renderer.show_scores(score_board)
            time.sleep(5)

    def round_start_up(self, round_number):
        self.renderer.show_round_instructions(round_number)
        self.dq_game.set_round_number(round_number)
        self.controller.start_round(round_number)

    def ask_question(self, question, index, answer_limit, repeat=False):

        self.controller.clear_current_answers()
        self.renderer.show_timer(
            config.get("questionOptions.questionTime"), self.controller.timeout
        )
        self.renderer.show_question(question, index)

        while True:

            self.controller.ask_question(
                question,
                self.dq_game.players,
                answer_limit,
            )

            if repeat == True and not self.controller.is_timeout:
                for player in self.dq_game.players:
                    if not player.blocked_for_wrong_answer:
                        has_answer, is_correct_answer, _ = self.dq_game.check_answer(
                            player, self.controller.current_answers, question
                        )

                        if has_answer and is_correct_answer:
                            repeat = False

                        elif has_answer and not is_correct_answer:
                            player.block_for_wrong_answer()
                            self.controller.show_player_answer_is_wrong(player.name)
                            answer_limit += 1
                            if answer_limit > len(self.dq_game.players):
                                repeat = False

            if repeat == False or self.controller.is_timeout:
                if len(self.controller.current_answers) == answer_limit:
                    answerless_players = self.controller.get_answerless_players(
                        self.dq_game.get_player_names()
                    )
                    self.controller.answer_limit_reached(answerless_players)

                self.controller.resolve_question()
                self.renderer.stop_timer()
                self.renderer.show_correct_answer(question, index)
                self.dq_game.consume_jokers(self.controller.current_played_jokers)
                self.dq_game.receive_answers(
                    self.controller.current_answers,
                    question,
                    self.controller.current_played_jokers,
                )
                break

        self.dq_game.undo_wrong_answer_blocks()
        self.dq_game.unblock_players()

    def start_joker_lottery(self):
        self.controller.start_joker_lottery()
        new_jokers = self.controller.get_joker_lottery_results()
        self.dq_game.add_jokers(new_jokers)
