import sys
import os

class Message:

  def __init__(self, origin, content_type, data):
    self.origin = origin
    self.content_type = content_type
    self.data = data
        