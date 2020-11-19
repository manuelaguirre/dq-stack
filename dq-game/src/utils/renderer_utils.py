def renderTextCenteredAt(renderer, text, y, font_size="small"):
    """
    Renderer. Display big text in multiple lines at an 'y' axis level.
    """
    # first, split the text into words
    words = text.split()
    # now, construct lines out of these words
    lines = []
    while len(words) > 0:
        # get as many words as will fit within allowed_width
        line_words = []
        while len(words) > 0:
            line_words.append(words.pop(0))
            fw, fh = renderer.fonts[font_size].size(" ".join(line_words + words[:1]))
            if fw > 9 * renderer.SCREEN_WIDTH / 10:
                break

        # add a line consisting of those words
        line = " ".join(line_words)
        lines.append(line)

    # now we've split our text into lines that fit into the width, actually
    # render them

    # we'll render each line below the last, so we need to keep track of
    # the culmative height of the lines we've rendered so far
    y_offset = 0
    for line in lines:
        fw, fh = renderer.fonts[font_size].size(line)

        # (tx, ty) is the top-left of the font surface
        tx = renderer.SCREEN_WIDTH / 2 - fw / 2
        ty = y + y_offset

        font_surface = renderer.fonts[font_size].render(line, True, (0, 0, 0))
        renderer.screen.blit(font_surface, (tx, ty))
        y_offset += fh


def showTextAt(renderer, font, pos_x, pos_y, text, color=(0, 0, 0)):
    text_ = renderer.fonts[font].render(text, True, color)
    text_rect = text_.get_rect(center=(pos_x, pos_y))
    renderer.screen.blit(text_, text_rect)
