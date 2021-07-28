from tilescopegui.utils import PathUtil


def test_paths():
    assert PathUtil.static_dir().split("/")[-2:] == ["tilescopegui", "static"]
    assert PathUtil.tempalte_dir().split("/")[-2:] == ["tilescopegui", "static"]
