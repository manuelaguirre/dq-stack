import sys
import os
from utils.renderer import Renderer

class ClientRenderer(Renderer):
  """
  Renderer for the client app
  """
  def __init__(self):
    super().__init__(1000, 600)

  def showQuestion(self):
    pass

  