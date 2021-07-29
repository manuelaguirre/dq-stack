from utils.renderer import Renderer


class FrontRenderer(Renderer):
    def __init__(self):
        super().__init__(400, 400, "client")
