from tests.testutils.mocks.mock_paths import MockPaths


def test_app():
    with MockPaths():
        from tilescopegui.factory import TestingConfig, create_app

        app = create_app(TestingConfig())
        app.blueprints["home_blueprint"].template_folder = MockPaths._TMP.as_posix()
        yield app
