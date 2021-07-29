from tests.testutils.mocks.mock_threading import MockThreading
from tests.testutils.mocks.mock_webbrowser import MockWebbrowser


def test_web():
    with MockThreading():
        with MockWebbrowser() as mw:

            from tilescopegui.utils import open_browser_tab

            open_browser_tab("myurl", 5)
            assert mw.calls == 1
            assert mw.url == "myurl"
