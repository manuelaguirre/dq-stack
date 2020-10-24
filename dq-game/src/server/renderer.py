from __future__ import print_function
import os
import pygame
from events.event_handler import EventHandler
from utils.renderer_utils import renderTextCenteredAt
import threading
from mock_data import mock_instructions
import time

class ServerRenderer(EventHandler):
  """
  Renderer for the server main app (Central app)
  TODO: Define super class Renderer to share it in the client
  """
  def __init__(self):
    self.screen = None
    self.font = None
    self.base_path = os.path.dirname(__file__)
    self.SCREEN_WIDTH = 1000
    self.SCREEN_HEIGHT = 600

  def initialize(self):
    """
    Initialize the renderer. Create pygame instance and call of the start game
    """
    pygame.init()
    self.screen = pygame.display.set_mode((self.SCREEN_WIDTH, self.SCREEN_HEIGHT))
    self.font = pygame.font.Font(os.path.join(self.base_path, 'fonts/YanoneKaffeesatz-Regular.ttf'), 32)
    pygame.display.set_caption("DefiQuizz")
    icon = pygame.image.load(os.path.join(self.base_path, 'images/icons/favicon.png'))
    pygame.display.set_icon(icon)
    self.show_logo()
    self.trigger('start_game')
    running = True
    while running: # main game loop
      for event in pygame.event.get():
        if event.type == pygame.QUIT:
          running = False
    
  def show_background(self):
    """
    Clear the screen. Only display the background
    """
    background = pygame.image.load(os.path.join(self.base_path, 'images/background.jpg'))
    background = pygame.transform.scale(background, (1000, 600))
    self.screen.blit(background, (0, 0))
    pygame.display.update()

  def show_logo(self):
    """
    Clear the screen and display logo
    """
    self.show_background()
    logo = pygame.image.load(os.path.join(self.base_path, 'images/icons/dqlogo.png'))
    logo_rect = logo.get_rect(center=(self.SCREEN_WIDTH/2, self.SCREEN_HEIGHT/2))
    self.screen.blit(logo, logo_rect)
    pygame.display.update()

  def show_instructions(self):
    """
    Public method to renderer the instructions async
    """
    threading.Thread(target=self._show_instructions).start()

  def _show_instructions(self):
    """
    Renderer the instructions
    """
    time.sleep(2)
    self.show_background()
    height_ins = 4*self.SCREEN_HEIGHT/6
    height_ins_i = 0.5*self.SCREEN_HEIGHT/6
    count = 1
    n = len(mock_instructions) + 1
    for instruction in mock_instructions:
      renderTextCenteredAt(self, instruction, count*height_ins/n + height_ins_i)
      count += 1
    pygame.display.update()
    time.sleep(4)
    self.show_logo()
    pygame.display.update()


  def show_question(self):
    pass

  def show_points(self):
    pass

  def show_timer(self):
    pass
