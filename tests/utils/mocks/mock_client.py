from tests.utils.mocks.mock_app import test_app


def client_generator():
    for app in test_app():
        with app.app_context(), app.test_client() as client:
            yield client
