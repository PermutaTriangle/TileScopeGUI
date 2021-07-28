import logging
import os

from tilescopegui.factory import DevConfig, ProdConfig, create_app


def test_create_app_dev():
    app = create_app(DevConfig())
    assert app.config["FLASK_ENV"] == "development"
    assert app.config["DEBUG"]
    assert not app.config["TESTING"]
    assert len(app.after_request_funcs) == 1


def test_create_app_prod():
    app = create_app(ProdConfig())
    assert app.config["FLASK_ENV"] == "production"
    assert not app.config["DEBUG"]
    assert not app.config["TESTING"]
    assert app.config["QUIET"]
    assert len(app.after_request_funcs) == 0
    assert logging.getLogger("werkzeug").disabled
    assert os.environ["WERKZEUG_RUN_MAIN"] == "true"
