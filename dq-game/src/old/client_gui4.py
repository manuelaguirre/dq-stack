import pygame
from pygame import mixer
import importlib.util

try:
    importlib.util.find_spec("RPi.GPIO")
    import RPi.GPIO as GPIO
except ImportError:
    import FakeRPi.GPIO as GPIO
import time
import sys
import math
import socket
import threading
import questions
from questions import question_dict

## Set-up pins (Emulate Buzzers)
## ######
GPIO.setmode(GPIO.BCM)

GPIO.setup(17, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(18, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(24, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(25, GPIO.IN, pull_up_down=GPIO.PUD_UP)


## ########################
DUREE_PARTIE = 45 * 60
DUREE_PAR_Q = 45
ts_debut_chrono = time.time()
ts_debut_partie = time.time()


def get_chrono(ts_debut_chrono):
    if ts_debut_chrono == -1:
        return "--:--"

    secondes_restant = DUREE_PARTIE - int(time.time() - ts_debut_chrono)

    if secondes_restant <= 0:
        ts_debut_chrono = -1
        ts_debut_partie = -1

    return "00:00"
    # return "%02d:%02d" % (math.floor(secondes_restant / 60), secondes_restant % 60)


## #############################


def tache_ecoute(sock):
    cmd = ""
    while True:
        data = sock.recv(1)
        if len(data) > 0:
            c = data[0]
            if c == "\n":
                print("Reception Ordre: %s" % cmd)
                cmd = ""
            elif c != "\r":
                cmd = "%s%c" % (cmd, c)


sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.setblocking(1)

while True:
    try:
        sock.connect((socket.gethostname(), 8000))
        print("Connection success")
        break
    except:
        print("Erreur serveur")
        time.sleep(1)

thread_1 = threading.Thread(target=tache_ecoute, args=(sock,))
thread_1.start()

time.sleep(1)

sock.sendall(b"id=module_borne1\n")
sock.sendall(b"version=1.0\n")


## Initialize pygame mixer
## ##########
mixer.init()
sound = mixer.Sound("sounds/applause-1.wav")


## activate the pygame library initiate pygame and give permission to use pygame's functionality.
## ########
pygame.init()

## define the RGB value for white, green, blue and red colours .
## ######
white = (255, 255, 255)
green = (0, 255, 0)
blue = (0, 0, 128)
red = (250, 0, 0)

## define display size
## ######
myScreenWidth = 1600
myScreenLength = 900


## Create the display area object dedicated to my dimensions
## ######
# screen = pygame.display.set_mode((1920,1080), pygame.FULLSCREEN)
screen = pygame.display.set_mode((myScreenWidth, myScreenLength))

## Set the pygame window name. (OPTIONAL)
## ###
pygame.display.set_caption("MyQUIZ")
clock = pygame.time.Clock()

## Create a font object
## ######
f = pygame.font.Font("fonts/Electromagnetic_Lungs.otf", 30)
font = pygame.font.Font("fonts/Electromagnetic_Lungs.otf", 52)
fonte_chrono = pygame.font.Font(None, 45)


# pygame.mouse.set_visible(False)

score = 0
TotalOfQuestions = len(question_dict)

for question, answers in question_dict.items():
    idx = 0
    reponse = "None"
    sts = "None"

    sock.sendall(reponse.encode("utf-8"))

    myListOfAnswers = answers.split()
    myGoodAnswer = int(myListOfAnswers[4])
    myImageToDisplay = myListOfAnswers[5]

    ## Create a text area object on which Question is drawn
    ## ######
    text = font.render(question, True, blue)
    textRect = text.get_rect()
    textRect.center = (myScreenWidth // 2, myScreenLength // 3)

    # create a surface object, image is drawn on it.
    image = pygame.image.load(myImageToDisplay)
    resizedImage = pygame.transform.rotozoom(image, 0, 0.7)
    run = True

    while run:
        ## MANAGE BUZZERS
        if GPIO.input(17) == 1:
            idx = 1
            reponse = myListOfAnswers[0]
            print("False 1")
            run = False

        elif GPIO.input(18) == 1:
            idx = 2
            reponse = myListOfAnswers[1]
            print("False 2")
            run = False

        elif GPIO.input(24) == 1:
            idx = 3
            reponse = myListOfAnswers[2]
            print("False 3")
            run = False

        elif GPIO.input(25) == 1:
            idx = 4
            reponse = myListOfAnswers[3]
            print("False 4")
            run = False

        if myGoodAnswer == idx:
            sts = "Gagne"
            score += 1
            sound.play()

        sock.send(
            ("%s - Status: %s - Score: %s\n" % (reponse, sts, score)).encode("utf-8")
        )

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                run = False
                print("False 5")
                pygame.quit()
                sys.exit(0)

            ## MANAGE MOUSE (TOUCH SCREEN EMULATION)
            elif event.type == pygame.MOUSEBUTTONDOWN:
                print(event)
                print(event.pos)
                pos = event.pos
                clic_x = pos[0]  # event.pos[0]
                clic_y = pos[1]  # event.pos[1]

                if clic_y >= 100 and clic_y <= 250:
                    if clic_x >= 500 and clic_x <= 650:
                        idx = 1
                        reponse = myListOfAnswers[0]
                        run = False
                        print("False 6")

                    elif clic_x >= 700 and clic_x <= 850:
                        idx = 2
                        reponse = myListOfAnswers[1]
                        run = False
                        print("False 6")

                    elif clic_x >= 900 and clic_x <= 1050:
                        idx = 3
                        reponse = myListOfAnswers[2]
                        run = False
                        print("False 6")

                    elif clic_x >= 1100 and clic_x <= 1250:
                        idx = 4
                        reponse = myListOfAnswers[3]
                        run = False
                        print("False 6")

                    if myGoodAnswer == idx:
                        sts = "Gagne"
                        score += 1
                    sound.play()

                    sock.send(("%s - %s\n" % (reponse, sts)).encode("utf-8"))

            screen.fill((0xC9, 0xC9, 0xC9))
            screen.blit(text, textRect)
            pygame.draw.rect(screen, white, (0, 0, myScreenWidth, 50), 0)
            label_chrono = fonte_chrono.render(get_chrono(ts_debut_chrono), 1, red)
            label_chrono_rect = label_chrono.get_rect(center=(myScreenWidth - 50, 25))
            screen.blit(label_chrono, label_chrono_rect)
            clock.tick(30)

            screen.blit(
                resizedImage,
                (
                    (myScreenWidth // 2) - (resizedImage.get_width() // 2),
                    (myScreenLength // 2) - (resizedImage.get_height() // 3) + 100,
                ),
            )

            if reponse != myListOfAnswers[0]:
                # pygame.draw.rect(screen, (250, 0, 0), (500, 100, 100, 100), 0)
                mybut = pygame.image.load("icones/RED_button_150T.png").convert_alpha()
                # position_mybut = mybut.get_rect()
                # position_mybut.center = 500,100

            else:
                # pygame.draw.rect(screen, (0, 250, 0), (500, 100, 100, 100), 0)
                mybut = pygame.image.load(
                    "icones/GREEN_button_150T.png"
                ).convert_alpha()

            ## BUZZER 0
            ## ########
            label = f.render(myListOfAnswers[0], 1, (0, 0, 0))
            position_mybut = mybut.get_rect()
            position_mybut.center = 575, 175
            screen.blit(mybut, position_mybut)
            screen.blit(label, label.get_rect(center=(580, 140)))

            if reponse != myListOfAnswers[1]:
                # pygame.draw.rect(screen, (250, 0, 0), (700, 100, 100, 100), 0)
                mybut = pygame.image.load("icones/RED_button_150T.png").convert_alpha()

            else:
                # pygame.draw.rect(screen, (0,250, 0), (700, 100, 100, 100), 0)
                mybut = pygame.image.load(
                    "icones/GREEN_button_150T.png"
                ).convert_alpha()

            ## BUZZER 1
            ## ########
            label = f.render(myListOfAnswers[1], 1, (0, 0, 0))
            position_mybut = mybut.get_rect()
            position_mybut.center = 775, 175
            screen.blit(mybut, position_mybut)
            screen.blit(label, label.get_rect(center=(780, 140)))

            if reponse != myListOfAnswers[2]:
                # pygame.draw.rect(screen, (250, 0, 0), (900, 100, 100, 100), 0)
                mybut = pygame.image.load("icones/RED_button_150T.png").convert_alpha()

            else:
                # pygame.draw.rect(screen, (0, 250, 0), (900, 100, 100, 100), 0)
                mybut = pygame.image.load(
                    "icones/GREEN_button_150T.png"
                ).convert_alpha()

            ## BUZZER 2
            ## ########
            label = f.render(myListOfAnswers[2], 1, (0, 0, 0))
            position_mybut = mybut.get_rect()
            position_mybut.center = 975, 175
            screen.blit(mybut, position_mybut)
            screen.blit(label, label.get_rect(center=(980, 140)))

            if reponse != myListOfAnswers[3]:
                # pygame.draw.rect(screen, (250, 0, 0), (1100, 100, 100, 100), 0)
                mybut = pygame.image.load("icones/RED_button_150T.png").convert_alpha()

            else:
                # pygame.draw.rect(screen, (0, 250, 0), (1100, 100, 100, 100), 0)
                mybut = pygame.image.load(
                    "icones/GREEN_button_150T.png"
                ).convert_alpha()

            ## BUZZER 3
            ## ########
            label = f.render(myListOfAnswers[3], 1, (0, 0, 0))
            position_mybut = mybut.get_rect()
            position_mybut.center = 1175, 175
            screen.blit(mybut, position_mybut)
            screen.blit(label, label.get_rect(center=(1180, 140)))

            pygame.display.update()
            clock.tick(30)
            time.sleep(0.5)

screen.fill((0, 0, 0))
pygame.display.flip()
clock.tick(30)
mysentence = (
    "Partie terminee apres {} (mn:ss) !! Votre score est de: {:d} de {:d}".format(
        get_chrono(ts_debut_chrono), score, TotalOfQuestions
    )
)
text = font.render(str(mysentence), True, blue)
textRect = text.get_rect()
textRect.center = (myScreenWidth // 2, myScreenLength // 3)
screen.blit(text, textRect)
pygame.display.update()
clock.tick(30)
pygame.quit()
sys.exit(0)
