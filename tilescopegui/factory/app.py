from flask import Flask


def create_app() -> Flask:
    """
    Create an instance of our API.
    """
    app = Flask(__name__)

    return app
