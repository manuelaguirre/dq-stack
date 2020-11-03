import os
import pygame
from events.event_handler import EventHandler
from utils.renderer_round_rect import round_rect


class Renderer(EventHandler):
    """
    Renderer for the server main app (Central app)
    TODO: Define super class Renderer to share it in the client
    """

    def __init__(self, SCREEN_WIDTH, SCREEN_HEIGHT):
        self.screen = None
        self.font = None
        self.SCREEN_WIDTH = SCREEN_WIDTH
        self.SCREEN_HEIGHT = SCREEN_HEIGHT
        self.base_path = os.path.dirname(__file__)

    def initialize(self):
        """
        Initialize the renderer. Create pygame instance and call of the start game
        """
        pygame.init()
        self.screen = pygame.display.set_mode((self.SCREEN_WIDTH, self.SCREEN_HEIGHT))
        self.font = pygame.font.Font(
            os.path.join(self.base_path, "fonts/YanoneKaffeesatz-Regular.ttf"), 32
        )
        pygame.display.set_caption("DefiQuizz")
        icon = pygame.image.load(
            os.path.abspath(
                os.path.join(
                    os.path.dirname(__file__), "..", "images/icons/favicon.png"
                )
            )
        )
        pygame.display.set_icon(icon)
        self.show_logo()
        self.trigger("RENDERER_START_GAME")
        running = True
        print("start running")
        while running:  # main game loop
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    pygame.quit()
                    print("stop running")
                    running = False

    def show_background(self):
        """
        Clear the screen. Only display the background
        """
        background = pygame.image.load(
            os.path.abspath(
                os.path.join(os.path.dirname(__file__), "..", "images/background.jpg")
            )
        )
        background = pygame.transform.scale(
            background, (self.SCREEN_WIDTH, self.SCREEN_HEIGHT)
        )
        self.screen.blit(background, (0, 0))
        self.update_screen()

    def show_logo(self):
        """
        Clear the screen and display logo
        """
        print("show_logo")
        self.show_background()
        logo = pygame.image.load(
            os.path.abspath(
                os.path.join(os.path.dirname(__file__), "..", "images/icons/dqlogo.png")
            )
        )
        logo_rect = logo.get_rect(
            center=(self.SCREEN_WIDTH / 2, self.SCREEN_HEIGHT / 2)
        )
        self.screen.blit(logo, logo_rect)
        self.update_screen()

    def update_screen(self):
        pygame.display.update()

    def display_button(self, text, x, y):
        self.draw_button_border(x - 80, y - 30, 160, 60)
        text_ = self.font.render(text, True, (255, 0, 0))
        text_rect = text_.get_rect(center=(x, y))
        self.screen.blit(text_, text_rect)
        # pygame.draw.rect(self.screen, (128, 128, 128), [x-80, y-20, 160, 40], 5)
        pygame.display.update()

    def draw_button_border(self, x, y, width, height):
        round_rect(
            self.screen, (x, y, width, height), (0, 0, 0), 10, 0, (255, 255, 255, 255)
        )
