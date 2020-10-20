from __future__ import print_function
import os
import pygame
from events.event_handler import EventHandler
from threading import Thread

class ServerRenderer(EventHandler):
  """
  Renderer for the server main app (Central app)
  """
  def __init__(self, startCallback):
    self.screen = None
    self.font = None
    self.on('start_game', startCallback)
    self.base_path = os.path.dirname(__file__)

  def initialize(self):
    pygame.init()
    self.screen = pygame.display.set_mode((1000, 600))
    self.font = pygame.font.Font(os.path.join(self.base_path, 'fonts/Ballerina.ttf'), 32)
    pygame.display.set_caption("DefiQuizz")
    icon = pygame.image.load(os.path.join(self.base_path, 'images/icons/favicon.png'))
    pygame.display.set_icon(icon)
    self.trigger('start_game')
    running = True
    while running: # main game loop
      for event in pygame.event.get():
        if event.type == pygame.QUIT:
          running = False
    
  def show_instructions(self):
    """
    Renderer the instructions
    """
    print('I will show the instructions')
    background = pygame.image.load(os.path.join(self.base_path, 'images/background.jpg'))
    background = pygame.transform.scale(background, (1000, 600))
    self.screen.blit(background, (0, 0))
    logo = pygame.image.load(os.path.join(self.base_path, 'images/icons/dqlogo_small.png'))
    self.screen.blit(logo, (280, 0))
    text_instructions = self.font.render('Instructions', False, (0, 0, 0))
    self.screen.blit(text_instructions, (320, 150))
    text_instructions = self.font.render('Instruction 1', False, (0, 0, 0))
    self.screen.blit(text_instructions, (320, 270))
    text_instructions = self.font.render('Instruction 2', False, (0, 0, 0))
    self.screen.blit(text_instructions, (320, 390))
    pygame.display.update()


  def show_question(self):
    pass

  def show_points(self):
    pass

  def show_timer(self):
    pass
