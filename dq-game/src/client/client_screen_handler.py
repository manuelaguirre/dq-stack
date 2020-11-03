import sys
import os
from events.event_handler import EventHandler


class ClientScreenHandler(EventHandler):
    """
    Creates a controller
    """

    def __init__(self, screen):
        self.screen = screen
