import traceback


class MockTraceback:
    def __init__(self):
        self.original = traceback.print_exc
        self.calls = 0

    def _mock_call(self):
        self.calls += 1

    def __enter__(self):
        traceback.print_exc = self._mock_call
        return self

    def __exit__(self, exc_type, exc_value, exc_traceback):
        traceback.print_exc = self.original
