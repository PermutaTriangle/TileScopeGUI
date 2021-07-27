import pytest

from tilescopegui.utils import TilingDecodeException


def test_tiling_decode_expection():
    with pytest.raises(TilingDecodeException):
        raise TilingDecodeException()
