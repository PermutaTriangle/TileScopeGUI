import logging
import os

from flask import Flask
from flask_cors import CORS

from ..blueprints import all_blueprints
from .config import Config
from .error_handler import get_error_handler


def quiet_mode() -> None:
    """Remove the logging from Werkzeug."""
    logging.getLogger("werkzeug").disabled = True
    os.environ["WERKZEUG_RUN_MAIN"] = "true"


def create_app(cfg: Config) -> Flask:
    """
    Create an instance of our API.
    """
    app = Flask(__name__, static_url_path="")
    app.config.from_object(cfg)
    app.register_error_handler(Exception, get_error_handler(app.config["DEBUG"]))
    for blueprint in all_blueprints():
        app.register_blueprint(blueprint)
    if app.config["QUIET"]:
        quiet_mode()
    if app.config["DEBUG"]:
        CORS(app)
    return app
