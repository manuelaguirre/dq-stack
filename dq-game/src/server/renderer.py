from __future__ import print_function
import os
import pygame
from events.event_handler import EventHandler
from threading import Thread
from mock_data import mock_instructions
import time

class ServerRenderer(EventHandler):
  """
  Renderer for the server main app (Central app)
  """
  def __init__(self, startCallback):
    self.screen = None
    self.font = None
    self.base_path = os.path.dirname(__file__)
    self.SCREEN_WIDTH = 1000
    self.SCREEN_HEIGHT = 600
    self.on('start_game', startCallback)

  def initialize(self):
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
    background = pygame.image.load(os.path.join(self.base_path, 'images/background.jpg'))
    background = pygame.transform.scale(background, (1000, 600))
    self.screen.blit(background, (0, 0))
    pygame.display.update()

  def show_logo(self):
    self.show_background()
    logo = pygame.image.load(os.path.join(self.base_path, 'images/icons/dqlogo.png'))
    logo_rect = logo.get_rect(center=(self.SCREEN_WIDTH/2, self.SCREEN_HEIGHT/2))
    self.screen.blit(logo, logo_rect)
    pygame.display.update()

  def show_instructions(self):
    """
    Renderer the instructions
    """
    print('I will show the instructions')
    time.sleep(2)
    self.show_background()
    height_ins = 4*self.SCREEN_HEIGHT/6
    height_ins_i = 0.5*self.SCREEN_HEIGHT/6
    count = 1
    n = len(mock_instructions) + 1
    for instruction in mock_instructions:
      self.renderTextCenteredAt(instruction, count*height_ins/n + height_ins_i)
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

  def renderTextCenteredAt(self, text, y):
    # first, split the text into words
    words = text.split()
    # now, construct lines out of these words
    lines = []
    while len(words) > 0:
        # get as many words as will fit within allowed_width
        line_words = []
        while len(words) > 0:
            line_words.append(words.pop(0))
            fw, fh = self.font.size(' '.join(line_words + words[:1]))
            if fw > 9*self.SCREEN_WIDTH/10:
                break

        # add a line consisting of those words
        line = ' '.join(line_words)
        lines.append(line)

    # now we've split our text into lines that fit into the width, actually
    # render them

    # we'll render each line below the last, so we need to keep track of
    # the culmative height of the lines we've rendered so far
    y_offset = 0
    for line in lines:
        fw, fh = self.font.size(line)

        # (tx, ty) is the top-left of the font surface
        tx = self.SCREEN_WIDTH/2 - fw / 2
        ty = y + y_offset

        font_surface = self.font.render(line, True, (0, 0, 0))
        self.screen.blit(font_surface, (tx, ty))
        y_offset += fh
