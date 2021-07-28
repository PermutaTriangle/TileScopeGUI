import sys
import webbrowser


class MockWebbrowser:
    def __init__(self):
        assert "webbrowser" in sys.modules
        self.original = sys.modules["webbrowser"].open_new_tab
        self.calls = 0
        self.url = None

    def _mock_call(self, url):
        self.calls += 1
        self.url = url

    def __enter__(self):
        sys.modules["webbrowser"].open_new_tab = self._mock_call
        return self

    def __exit__(self, exc_type, exc_value, exc_traceback):
        sys.modules["webbrowser"].open_new_tab = self.original
