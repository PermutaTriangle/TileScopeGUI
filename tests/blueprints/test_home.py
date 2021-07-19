from pathlib import Path

import pytest

import tilescopegui.utils.paths


@pytest.fixture
def mock_static_path(monkeypatch):
    mock_path = Path(__file__).parent.parent.joinpath("utils", "mocks", "static")

    monkeypatch.setattr(tilescopegui.utils.paths.PathUtil, "_STATIC_DIR", mock_path)
    monkeypatch.setattr(tilescopegui.utils.paths.PathUtil, "_TEMPLATE_DIR", mock_path)


@pytest.fixture
def client(mock_static_path):
    from tilescopegui.factory import TestingConfig, create_app

    app = create_app(TestingConfig())
    with app.app_context(), app.test_client() as client:
        yield client


def test_index(client):
    res = client.get("/")
    assert res.status_code == 200
    assert res.mimetype == "text/html"
    assert (
        res.data.decode("utf-8") == "<html><head></head><body></body><p>MOCK</p></html>"
    )


def test_index_through_static(client):
    res = client.get("/static/index.html")
    assert res.status_code == 404


def test_double_dots_in_static(client):
    res = client.get("/static/../../access_to_forbidden")
    assert res.status_code == 400


def test_static(client):
    res = client.get("/static/index.js")
    assert res.status_code == 200
    assert res.mimetype == "application/javascript"
    assert res.data.decode("utf-8") == '(() => {\n  alert("mock");\n})();\n'
