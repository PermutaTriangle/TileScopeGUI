from typing import Dict, Text, Union

from flask import Blueprint, render_template, request, send_from_directory
from werkzeug import Response
from werkzeug.exceptions import BadRequest, NotFound

from ..utils import PathUtil

home_blueprint = Blueprint(
    "home_blueprint", __name__, template_folder=PathUtil.tempalte_dir()
)


@home_blueprint.route("/", methods=["GET"])
def home() -> Text:
    """Render the default html page."""
    return render_template("index.html")


@home_blueprint.route("/static/<path:path>", methods=["GET"])
def static(path: str) -> Response:
    """Serve static files."""
    if ".." in path:
        raise BadRequest()
    if path == "index.html":
        raise NotFound()
    return send_from_directory(PathUtil.static_dir(), path)


@home_blueprint.route("/api/test/<int:x>", methods=["POST"])
def endpoint_test(x: int) -> Dict[str, Union[int, str]]:
    """Test to see if js stuff works, TODO: REMOVE."""
    data: dict = request.get_json()
    _b: str = data["b"]
    return {"a": x ** 2, "b": _b}
