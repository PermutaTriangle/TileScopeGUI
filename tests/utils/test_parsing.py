from tests.testutils.mocks.mock_args import MockArgs
from tilescopegui.utils import Arguments, Constant


def _asserter(args, debug=False, browser=True, url=Constant.DEFAULT_URL):
    assert args.debug == debug
    assert args.browser == browser
    assert args.url == url


def test_arguments():
    with MockArgs("-d"):
        _asserter(Arguments.parse(), debug=True)
    with MockArgs("--debug"):
        _asserter(Arguments.parse(), debug=True)
    with MockArgs("-u", "myurl"):
        _asserter(Arguments.parse(), url="myurl")
    with MockArgs("--url", "myurl"):
        _asserter(Arguments.parse(), url="myurl")
    with MockArgs("-b"):
        _asserter(Arguments.parse(), browser=False)
    with MockArgs("--no-browser"):
        _asserter(Arguments.parse(), browser=False)
    with MockArgs("-d", "-u", "myurl", "--no-browser"):
        _asserter(Arguments.parse(), debug=True, url="myurl", browser=False)
