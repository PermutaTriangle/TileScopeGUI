from flask import Blueprint, redirect, request, send_from_directory
from werkzeug import Response

from ..utils import kill_server

home_blueprint = Blueprint("home_blueprint", __name__)


@home_blueprint.route("/", methods=["GET"])
def home() -> Response:
    """Home page."""
    return redirect("/static/index.html")


@home_blueprint.route("/static/<path:path>", methods=["GET"])
def static(path: str) -> Response:
    """Serve static files."""
    return send_from_directory("../static", path)


@home_blueprint.route("/kamikazee", methods=["GET"])
def shut_down() -> str:
    """Terminate server."""
    kill_server(request)
    return "Goodbye"
