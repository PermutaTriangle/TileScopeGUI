import pytest

from tests.utils.mocks.mock_paths import MockPaths


@pytest.fixture
def test_app():
    with MockPaths():
        from tilescopegui.factory import TestingConfig, create_app

        app = create_app(TestingConfig())
        app.blueprints["home_blueprint"].template_folder = MockPaths._TMP.as_posix()
        yield app


@pytest.fixture
def client(test_app):
    with test_app.app_context(), test_app.test_client() as client:
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
