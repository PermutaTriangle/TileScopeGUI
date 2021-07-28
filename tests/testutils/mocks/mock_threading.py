import sys
import threading


class _MockTimer:
    def __init__(self, delay, to_call):
        self.to_call = to_call
        self.delay = delay

    def start(self):
        self.to_call()


class MockThreading:
    def __init__(self):
        assert "threading" in sys.modules
        self.original = sys.modules["threading"].Timer

    def __enter__(self):
        sys.modules["threading"].Timer = _MockTimer

    def __exit__(self, exc_type, exc_value, exc_traceback):
        sys.modules["threading"].Timer = self.original
