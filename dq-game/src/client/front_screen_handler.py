from utils.socket_connection import FrontSocketConnection


class FrontScreenHandler:
    def __init__(self):
        self.socket = FrontSocketConnection(8887)

    def wait_for_front_screen(self):
        self.socket.listen(1)
