import json
from base64 import b64decode

import pytest
from tilings import GriddedPerm, Tiling, TrackingAssumption

from tilescopegui.factory import TestingConfig, create_app

_HEADERS = {"Accept": "application/json", "Content-Type": "application/json"}

_INIT_PATH = "/api/tiling/init"


@pytest.fixture
def client():
    app = create_app(TestingConfig())
    with app.app_context(), app.test_client() as client:
        yield client


def post(cli, path: str, data, headers=_HEADERS):
    return cli.post(path, data=json.dumps(data), headers=headers)


def assert_code_and_mimetype(res, mimetype="application/json", code=200):
    assert res.status_code == code
    assert res.mimetype == mimetype


def assert_tiling(
    data,
    expected,
    requirements=[],
    assumptions=[],
    crossing=[],
    label_map={},
    matrix=[],
    verified=None,
):
    tiling = Tiling.from_dict(data["tiling"])
    assert expected == tiling
    assert Tiling.from_bytes(b64decode(data["key"])) == expected
    if verified is None:
        assert data["verified"] is None
    else:
        verification_rule = data["verified"]
        assert verification_rule["class_module"] == "comb_spec_searcher.strategies.rule"
        assert verification_rule["rule_class"] == "VerificationRule"
        assert Tiling.from_dict(verification_rule["comb_class"]) == expected
        assert verification_rule["formal_step"] == verified
    plot = data["plot"]
    assert plot["assumptions"] == assumptions
    assert plot["crossing"] == crossing
    assert plot["requirements"] == requirements
    assert plot["label_map"] == label_map
    assert plot["matrix"] == matrix


def test_tiling_from_string(client):
    res = post(client, _INIT_PATH, "123")
    assert_code_and_mimetype(res)
    assert_tiling(
        res.json, Tiling.from_string("123"), label_map={"1": "Av(123)"}, matrix=[["1"]]
    )


def test_tiling_from_string_ie_verified(client):
    res = post(client, _INIT_PATH, "123_321")
    assert_code_and_mimetype(res)
    assert_tiling(
        res.json,
        Tiling.from_string("123_321"),
        label_map={"1": "Av(123, 321)"},
        matrix=[["1"]],
        verified="tiling has a regular insertion encoding",
    )


def test_tiling_from_string_atom_verified(client):
    res = post(client, _INIT_PATH, "1")
    assert_code_and_mimetype(res)
    assert_tiling(
        res.json,
        Tiling.from_string("1"),
        matrix=[["ε"]],
        verified="is atom",
    )


def test_tiling_from_string_empty(client):
    res = post(client, _INIT_PATH, "")
    assert_code_and_mimetype(res)


def test_tiling_from_dict(client):
    tiling = Tiling(
        obstructions=(
            GriddedPerm((0, 1), ((0, 0), (0, 0))),
            GriddedPerm((0, 1), ((1, 1), (1, 1))),
            GriddedPerm((0, 1, 2), ((0, 0), (1, 0), (1, 0))),
            GriddedPerm((0, 1, 2), ((0, 0), (1, 0), (1, 1))),
            GriddedPerm((0, 1, 2), ((1, 0), (1, 0), (1, 0))),
            GriddedPerm((0, 1, 2), ((1, 0), (1, 0), (1, 1))),
        ),
        requirements=((GriddedPerm((0,), ((1, 0),)),),),
        assumptions=(
            TrackingAssumption(
                [
                    GriddedPerm.single_cell((0,), (0, 0)),
                    GriddedPerm.single_cell((0,), (1, 0)),
                ]
            ),
            TrackingAssumption([GriddedPerm.single_cell((0,), (1, 1))]),
        ),
    )
    res = post(client, _INIT_PATH, tiling.to_jsonable())
    assert_code_and_mimetype(res)
    assert_tiling(
        res.json,
        tiling,
        assumptions=[["0: (0, 0)", "0: (1, 0)"], ["0: (1, 1)"]],
        crossing=[
            "012: (0, 0), (1, 0), (1, 0)",
            "012: (0, 0), (1, 0), (1, 1)",
            "012: (1, 0), (1, 0), (1, 1)",
        ],
        label_map={"1": "Av+(123)"},
        matrix=[[" ", "\\"], ["\\", "1"]],
        requirements=[["0: (1, 0)"]],
    )


def test_tiling_from_dict_atom_verified(client):
    tiling = Tiling(
        obstructions=(
            GriddedPerm((0, 1), ((0, 0), (0, 0))),
            GriddedPerm((1, 0), ((0, 0), (0, 0))),
        ),
        requirements=((GriddedPerm((0,), ((0, 0),)),),),
        assumptions=(),
    )
    res = post(client, _INIT_PATH, tiling.to_jsonable())
    assert_code_and_mimetype(res)
    assert_tiling(
        res.json,
        tiling,
        verified="is atom",
        requirements=[["0: (0, 0)"]],
        matrix=[["●"]],
    )


def test_tiling_from_dict_locally_factorable_verified(client):
    tiling = Tiling(
        obstructions=(
            GriddedPerm((0, 1), ((0, 2), (0, 2))),
            GriddedPerm((0, 1), ((1, 1), (1, 1))),
            GriddedPerm((0, 1), ((2, 0), (2, 0))),
            GriddedPerm((1, 0), ((0, 2), (0, 2))),
            GriddedPerm((1, 0), ((1, 1), (1, 1))),
        ),
        requirements=((GriddedPerm((0,), ((0, 2),)),), (GriddedPerm((0,), ((1, 1),)),)),
        assumptions=(),
    )
    res = post(client, _INIT_PATH, tiling.to_jsonable())
    assert_code_and_mimetype(res)
    assert_tiling(
        res.json,
        tiling,
        verified="tiling is locally factorable",
        requirements=[["0: (0, 2)"], ["0: (1, 1)"]],
        matrix=[["●", " ", " "], [" ", "●", " "], [" ", " ", "\\"]],
    )


def test_tiling_from_invalid(client):
    res = post(client, _INIT_PATH, 5)
    assert_code_and_mimetype(res, code=400)
    res = post(client, _INIT_PATH, False)
    assert_code_and_mimetype(res, code=400)
    res = post(client, _INIT_PATH, [])
    assert_code_and_mimetype(res, code=400)
    res = post(client, _INIT_PATH, None)
    assert_code_and_mimetype(res, code=400)
    res = post(client, _INIT_PATH, 3.7)
    assert_code_and_mimetype(res, code=400)
    res = post(client, _INIT_PATH, {"not_a_tiling_dict": True})
    assert_code_and_mimetype(res, code=400)
