from random import choice, shuffle
import pygame


def render_multiline_text(renderer, text, y, font_size="small"):
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


def show_text_at(renderer, font, pos_x, pos_y, text, color=(0, 0, 0), centered=True):
    text_ = renderer.fonts[font].render(text, True, color)
    if centered:
        text_rect = text_.get_rect(center=(pos_x, pos_y))
        renderer.screen.blit(text_, text_rect)
    else:
        renderer.screen.blit(text_, (pos_x, pos_y))


def render_table(renderer, rows, grid, who="", icons={}):
    """
    Render a points table. \n
    Example \n
    Rows: [[ 'Jean Baptiste' , '3', '+3', ... ]] \n
    Grid: (4,1,1) # Size of the columns grid \n
    Who: 'Jean Baptiste' # The name which will be highlighted \n
    Icons: { "CORRECT": _image_ } # dict with icons \n
    """
    grid_list = list(grid)

    margin_x = renderer.SCREEN_WIDTH // 5
    margin_y = renderer.SCREEN_HEIGHT // 10
    row_height = 8 / 10 * renderer.SCREEN_HEIGHT // len(rows)
    row_height = min(row_height, 2 / 10 * renderer.SCREEN_HEIGHT)
    cell_width = (renderer.SCREEN_WIDTH - 2 * margin_x) // sum(grid)

    for row_index, row in enumerate(rows):
        pos_y = margin_y + row_height * (row_index + 0.5)

        for cell_index, cell in enumerate(row):
            # Calculate the size of the cell
            pos_x = margin_x + sum(grid_list[:cell_index]) * cell_width
            color = (0, 0, 0)

            font_size = "medium"
            if cell_index == 2:
                font_size = "small"

            # Display result or joker icon
            if "__image" in cell:
                icon_image = icons[cell["__image"]]
                if icon_image:
                    image_width = renderer.SCREEN_WIDTH // 15
                    proportion = image_width / icon_image.get_rect().width
                    image_height = proportion * icon_image.get_rect().height
                    icon_image_scaled = pygame.transform.scale(
                        icon_image, (int(image_width), int(image_height))
                    )
                    icon_image_rect = icon_image_scaled.get_rect(
                        center=(pos_x, pos_y + image_height / 4)
                    )
                    renderer.screen.blit(icon_image_scaled, icon_image_rect)
            else:
                # Highlight player name
                if cell_index == 1 and who == cell:
                    color = (25, 220, 25)
                    cell = "· " + cell
                # Check if the diff exists
                if cell_index == 3 and len(cell) > 1:
                    if cell[0] == "+" and cell[1] != "0":
                        color = (25, 220, 25)
                    elif cell[0] == "+" and cell[1] == "0":
                        cell = ""
                    elif cell[0] == "-":
                        color = (220, 25, 25)
                show_text_at(
                    renderer, font_size, pos_x, pos_y, cell, color, centered=False
                )


def chop_answers(answers, correct_answer):
    correct_answer_text = answers.pop(correct_answer)
    answers = [
        correct_answer_text,
        choice(answers),
    ]
    shuffle(answers)
    return answers, answers.index(correct_answer_text)
