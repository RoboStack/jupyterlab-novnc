import json

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado
from tornado.web import StaticFileHandler

from os import path


ROOT = path.dirname(__file__)
PUBLIC = path.join(ROOT, 'novnc')


class RouteHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server

    def set_default_headers(self):
        self.set_header("Content-Type", 'application/json')

    @tornado.web.authenticated
    def get(self):
        self.finish(json.dumps({
            "data": "This is /novnc/get_example endpoint!"
        }))


def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    route_pattern = url_path_join(base_url, "novnc", "get_example")
    url_path = 'novnc'
    route_novnc = url_path_join(base_url, url_path, "app")

    print(f"adding route for static file handler: {route_novnc}")
    print(f"serving files: {PUBLIC}")

    handlers = [
        (route_pattern, RouteHandler),
        ("{}/(.*)".format(route_novnc), StaticFileHandler, {"path": PUBLIC})
    ]
    web_app.add_handlers(host_pattern, handlers)
