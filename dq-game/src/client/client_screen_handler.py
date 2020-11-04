import sys
import os
from events.event_handler import EventHandler


class ClientScreenHandler(EventHandler):
    """
    Handle touch events
    """

    def __init__(self):
        self.objects = []  # type (init: (x,y), end: (x,y), value: string)
        self.touch_callback = None

    def handle_touch(self, click_x, click_y):
        # type: (int, int, function) -> function
        print(click_x, click_y)
        if self.touch_callback:
            for obj in self.objects:
                if obj["init"][0] < click_x & click_x < obj["end"][0]:
                    if obj["init"][1] < click_y & click_y < obj["end"][1]:
                        self.touch_callback(obj["value"])
                        return
            self.touch_callback(None)

    def add_object(self, obj):
        if (obj["init"][0] > 0) & (obj["init"][1] > 0):
            if (obj["end"][0] > 0) & (obj["end"][1] > 0):
                self.objects.append(obj)

    def add_touch_callback(self, callback):
        self.touch_callback = callback

    def clear_data(self):
        self.objects = []
        self.touch_callback = None
