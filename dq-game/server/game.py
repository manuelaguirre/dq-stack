import sys
import os

class DQGame:
  """
  Main class for a game instance
  """
  callbacks = {}

  def __init__(self):
    print('Creating a new game')
  
  def on(self, event_name, callback):
    # Add callback to the list of event_name callback list
    print('Add: ', event_name)
    if event_name not in self.callbacks:
      self.callbacks[event_name] = [callback]
    else:
      self.callbacks[event_name].append(callback)

  def trigger(self, event_name):
    if event_name in self.callbacks:
      for callback in self.callbacks[event_name]:
        callback()

  def start(self):
    self.trigger('show_instructions')