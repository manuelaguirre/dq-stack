import tornado.websocket
import time
from threading import Thread
import threading
import io
import base64
import tornado.httpserver
import tornado.web
import os.path
import sys
import os
import importlib.util

try:
    importlib.util.find_spec("RPi.GPIO")
    import RPi.GPIO as GPIO
except ImportError:
    import FakeRPi.GPIO as GPIO
import socket

# reponse = -1
reponse = "None"


def tache_client(sock, ip):
    global reponse
    #  buf = ''
    buf = ""
    while True:
        b = sock.recv(1)
        if not b:
            break
        b = chr(b[0])
        if b == "\n":
            try:
                # reponse = int(buf)
                reponse = str(buf)
            except:
                # reponse = 0
                reponse = "None"
            # buf = ''
            buf = ""
        elif b != "\r":
            buf += b


tcpsock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
tcpsock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
tcpsock.bind((socket.gethostname(), 8000))
tcpsock.listen(10)


def tache_serveur():
    while True:
        clientsocket, address = tcpsock.accept()
        thread_client = threading.Thread(
            target=tache_client, args=(clientsocket, address)
        )
        thread_client.start()


ths = threading.Thread(target=tache_serveur)
ths.start()


class wwwHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")


clients_ws = []


class WebSocketCommun(tornado.websocket.WebSocketHandler):
    def open(self):
        self.stream.set_nodelay(True)
        clients_ws.append(self)

    def on_close(self):
        clients_ws.remove(self)

    @staticmethod
    def tache_thread_ws():
        global reponse
        while True:
            flux = {
                "reponse": reponse,
            }
            for client in clients_ws:
                client.write_message(flux)
            time.sleep(0.5)


settings = dict(
    template_path=os.path.join(os.path.dirname(__file__), "templates"),
    static_path=os.path.join(os.path.dirname(__file__), "static"),
    autoescape=None,
    cookie_secret=str(os.urandom(45)),
    xsrf_cookies=True,
)

try:
    thread_ws = threading.Thread(target=WebSocketCommun.tache_thread_ws)
    thread_ws.start()

    application = tornado.web.Application(
        [(r"/", wwwHandler), (r"/ws", WebSocketCommun)], autoreload=True, **settings
    )
    http_server = tornado.httpserver.HTTPServer(application)

    http_server.listen(8080)
    main_loop = tornado.ioloop.IOLoop.instance()
    main_loop.start()
except KeyboardInterrupt:
    pass
except Exception as e:
    print(e)
os._exit(0)
