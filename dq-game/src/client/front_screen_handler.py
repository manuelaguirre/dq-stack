from utils.socket_connection import FrontSocketConnection


class FrontScreenHandler:
    def __init__(self):
        self.socket = FrontSocketConnection(8880)

    def wait_for_front_screen(self):
        self.socket.listen(1)

    def timeout(self):
        self.socket.send_to_all("TIMEOUT", "event")

    def set_username(self, username):
        self.socket.send_to_all(username, "data-username")
        self.socket.send_to_all("SET_USERNAME", "event")

    def show_instructions_and_ready_up(self):
        self.socket.send_to_all("SHOW_INSTRUCTIONS_AND_READY_UP", "event")

    def choose_theme(self):
        self.socket.send_to_all("CHOOSE_THEME", "event")

    def start_round(self):
        self.socket.send_to_all("START_ROUND", "event")

    def show_upcoming_question_theme(self, theme):
        self.socket.send_to_all(theme, "data-upcoming-question-theme")
        self.socket.send_to_all("SHOW_UPCOMING_QUESTION_THEME", "event")

    def answer_question(self):
        self.socket.send_to_all("ANSWER_QUESTION", "event")

    def show_blocked(self, blocking_player):
        self.socket.send_to_all(blocking_player, "data-blocking-player")
        self.socket.send_to_all("SHOW_BLOCKED", "event")

    def resolve_question(self, selected, choice_letter, status):
        self.socket.send_to_all((selected, choice_letter, status), "data-answer-and-status")
        self.socket.send_to_all("RESOLVE_QUESTION", "event")

    def show_scores(self, diff, total):
        self.socket.send_to_all((diff,total), "data-scores")
        self.socket.send_to_all("SHOW_SCORES", "event")

    def start_lottery(self):
        self.socket.send_to_all("START_LOTTERY", "event")
