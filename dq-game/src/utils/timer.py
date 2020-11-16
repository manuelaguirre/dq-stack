import sys
import os
import time
from threading import Thread


class Timer:
    def __init__(self, seconds):
        self.seconds = 0
        self.timeout_callback = None

    def tick(self, tick_callback):
        self.seconds -= 1
        tick_callback(self.seconds)

    def start(self, tick_callback):
        time.sleep(1)
        while self.seconds > 0:
            self.tick(tick_callback)
            time.sleep(1)
        if self.timeout_callback:
            self.timeout_callback()

    def stop(self):
        self.timeout_callback = None
        self.seconds = 0

    def reset(self, seconds, tick_callback, timeout_callback):
        self.seconds = seconds
        self.timeout_callback = timeout_callback
        timer_thread = Thread(target=self.start, args=(tick_callback,))
        timer_thread.start()
