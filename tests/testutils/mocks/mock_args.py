import sys


class MockArgs:
    def __init__(self, *args: str) -> None:
        self.original = sys.argv
        self.args = args

    def __enter__(self):
        sys.argv = ["name", *self.args]

    def __exit__(self, exc_type, exc_value, exc_traceback):
        sys.argv = self.original
