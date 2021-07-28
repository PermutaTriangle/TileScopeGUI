from tilescopegui.factory import DevConfig, ProdConfig, TestingConfig


def base_asserter(cfg):
    assert cfg.STATIC_FOLDER == "static"
    assert cfg.CACHE_TYPE == "simple"
    assert cfg.CACHE_DEFAULT_TIMEOUT == 3600


def test_prod_cfg():
    cfg = ProdConfig()
    base_asserter(cfg)
    assert cfg.FLASK_ENV == "production"
    assert not cfg.DEBUG
    assert not cfg.TESTING
    assert cfg.QUIET


def test_dev_cfg():
    cfg = DevConfig()
    base_asserter(cfg)
    assert cfg.FLASK_ENV == "development"
    assert cfg.DEBUG
    assert not cfg.TESTING
    assert not cfg.QUIET


def test_test_cfg():
    cfg = TestingConfig()
    base_asserter(cfg)
    assert cfg.FLASK_ENV == "development"
    assert cfg.DEBUG
    assert cfg.TESTING
    assert not cfg.QUIET
