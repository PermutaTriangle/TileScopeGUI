from werkzeug.exceptions import ImATeapot

from tests.testutils.mocks.mock_traceback import MockTraceback
from tilescopegui.factory.error_handler import get_error_handler


def test_error_handler():
    with MockTraceback() as mtb:
        handler = get_error_handler(True)
        ex = Exception("My Exception")
        res = handler(ex)
        assert res.status_code == 500
        assert res.mimetype == "application/json"
        assert mtb.calls == 1

    with MockTraceback() as mtb:
        handler = get_error_handler(True)
        ex = ImATeapot("My Exception")
        res = handler(ex)
        assert res.status_code == 418
        assert res.mimetype == "application/json"
        assert mtb.calls == 0

    with MockTraceback() as mtb:
        handler = get_error_handler()
        ex = Exception("My Exception")
        res = handler(ex)
        assert res.status_code == 500
        assert res.mimetype == "application/json"
        assert mtb.calls == 0

    with MockTraceback() as mtb:
        handler = get_error_handler()
        ex = ImATeapot("My Exception")
        res = handler(ex)
        assert res.status_code == 418
        assert res.mimetype == "application/json"
        assert mtb.calls == 0
