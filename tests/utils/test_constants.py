from tilescopegui.utils import Constant


def test_constants():
    assert Constant.BROWSER_OPEN_DELAY == 2
    assert Constant.DEFAULT_URL == "http://127.0.0.1:5000/"
