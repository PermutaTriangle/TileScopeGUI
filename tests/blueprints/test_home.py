import pytest

from tests.utils.mocks.mock_client import client_generator


@pytest.fixture
def client():
    yield from client_generator()


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
