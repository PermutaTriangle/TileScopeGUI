from pathlib import Path

from tilescopegui.utils.paths import PathUtil


class MockPaths:
    _TMP = Path(__file__).parent.joinpath("static")

    def __init__(self) -> None:
        self.original_template = PathUtil._TEMPLATE_DIR
        self.original_static = PathUtil._STATIC_DIR

    def __enter__(self):
        PathUtil._TEMPLATE_DIR = MockPaths._TMP
        PathUtil._STATIC_DIR = MockPaths._TMP

    def __exit__(self, exc_type, exc_value, exc_traceback):
        PathUtil._TEMPLATE_DIR = self.original_template
        PathUtil._STATIC_DIR = self.original_static
