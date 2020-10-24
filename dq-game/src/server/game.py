from events.event_handler import EventHandler

class DQGame(EventHandler):
  """
  Main class for a game instance
  """
  def __init__(self):
    print('Creating a new game')
 
  def start(self):
    self.trigger('show_instructions')
