import json
from typing import Any

import pytest
from permuta.misc import DIR_EAST, DIR_NORTH, DIR_SOUTH, DIR_WEST
from permuta.patterns.perm import Perm
from tilings import GriddedPerm, Tiling

from tests.testutils.mocks.mock_client import client_generator
from tilescopegui.combinatorics.tilings import encode_tiling

_HEADERS = {"Accept": "application/json", "Content-Type": "application/json"}

_PATH_PREFIX = "/api/strategies"

_EMPTY_VERIFY = {"strats": [], "basis": []}
_IE_LF_VERIFY = {"strats": [0, 1], "basis": []}


def _all_verify(basis):
    return {"strats": list(range(5)), "basis": basis}


def invalid_tilings():
    return [None, 5, 2.5, False, "str", [1, 2, 3], {"not a tiling": True}]


def invalid_dirs():
    return [-1, 4, None, 5, 2.5, "str", [1, 2, 3], {"not a dir": True}]


def invalid_rows():
    return [0, 1.1, None, "str", [1, 2, 3], {"not a row-bool": True}]


def invalid_idx():
    return [1.1, None, "str", [1, 2, 3], {"not a idx": True}]


@pytest.fixture
def client():
    yield from client_generator()


def verify_wrap_tiling(tiling: Tiling, verify=_EMPTY_VERIFY) -> dict:
    return {"tiling": encode_tiling(tiling), "verify": verify}


def verify_wrap_invalid(invalid_tiling: Any, verify=_EMPTY_VERIFY) -> dict:
    return {"tiling": invalid_tiling, "verify": verify}


def post(cli, path: str, data, headers=_HEADERS):
    return cli.post(path, data=json.dumps(data), headers=headers)


def assert_code_and_mimetype(res, mimetype="application/json", code=200):
    assert res.status_code == code
    assert res.mimetype == mimetype


##########
# Factor #
##########


def test_factor_invalid_type(client):
    for inp in invalid_tilings():
        assert_code_and_mimetype(
            post(client, f"{_PATH_PREFIX}/factor", verify_wrap_invalid(inp)), code=400
        )
        assert_code_and_mimetype(post(client, f"{_PATH_PREFIX}/factor", inp), code=400)
    assert_code_and_mimetype(
        post(client, f"{_PATH_PREFIX}/factor", verify_wrap_tiling(Tiling(), None)),
        code=400,
    )


def test_factor_does_not_apply(client):
    t = Tiling(
        obstructions=(
            GriddedPerm((0, 1), ((0, 0), (1, 0))),
            GriddedPerm((0, 2, 1), ((0, 0), (0, 0), (0, 0))),
            GriddedPerm((0, 2, 1), ((1, 0), (1, 0), (1, 0))),
        ),
        requirements=(),
        assumptions=(),
    )
    assert_code_and_mimetype(
        post(client, f"{_PATH_PREFIX}/factor", verify_wrap_tiling(t)), code=400
    )
    assert_code_and_mimetype(
        post(client, f"{_PATH_PREFIX}/factor?interleaving=all", verify_wrap_tiling(t)),
        code=400,
    )


def test_factor_invalid_operation(client):
    t = (
        Tiling.from_string("123")
        .add_requirement(Perm((0,)), ((0, 0),))
        .place_point_in_cell((0, 0), 1)
    )
    assert_code_and_mimetype(
        post(
            client,
            f"{_PATH_PREFIX}/factor?interleaving=invalid-op",
            verify_wrap_tiling(t),
        ),
        code=400,
    )


def test_factor(client):
    def _factor_t_helper(cli, t, interleaving):
        res = post(
            cli,
            f"{_PATH_PREFIX}/factor{'?interleaving=all' if interleaving else ''}",
            verify_wrap_tiling(t),
        )
        assert_code_and_mimetype(res)
        assert res.json["class_module"] == "comb_spec_searcher.strategies.rule"
        assert res.json["rule_class"] == "Rule"
        if interleaving:
            assert res.json["op"] == "*"
            assert (
                res.json["formal_step"]
                == "interleaving factor with partition {(0, 4)} / {(1, 5)} / {(2, 0), (2, 2), (6, 0)} / {(3, 1)} / {(4, 2)} / {(5, 3)}"
            )
            assert res.json["strategy"] == {
                "class_module": "tilings.strategies.factor",
                "ignore_parent": True,
                "partition": [
                    [[0, 4]],
                    [[1, 5]],
                    [[2, 0], [2, 2], [6, 0]],
                    [[3, 1]],
                    [[4, 2]],
                    [[5, 3]],
                ],
                "strategy_class": "FactorWithInterleavingStrategy",
                "workable": True,
            }
            assert all(
                key == c["key"]
                for key, c in zip(
                    [
                        "AQADAAIBAAAAAAAAAAA=",
                        "AgACAAEAAAAAAgEAAAAAAAEAAQABAAAA",
                        "BgABAAEBAgABAAAAAAIAAQAAAAECAAEAAAEAAgABAAEAAQMAAgEBAAEAAQABAAEAAQAAAA==",
                        "AgACAAEAAAAAAgEAAAAAAAEAAQABAAAA",
                        "AQACAQAAAAAAAAA=",
                        "AgACAAEAAAAAAgEAAAAAAAEAAQABAAAA",
                    ],
                    res.json["children"],
                )
            )
        else:
            assert res.json["op"] == "x"
            assert (
                res.json["formal_step"]
                == "factor with partition {(0, 4)} / {(1, 5)} / {(2, 0), (2, 2), (4, 2), (6, 0)} / {(3, 1)} / {(5, 3)}"
            )
            assert res.json["strategy"] == {
                "class_module": "tilings.strategies.factor",
                "ignore_parent": True,
                "partition": [
                    [[0, 4]],
                    [[1, 5]],
                    [[2, 0], [2, 2], [4, 2], [6, 0]],
                    [[3, 1]],
                    [[5, 3]],
                ],
                "strategy_class": "FactorStrategy",
                "workable": True,
            }
            assert all(
                key == c["key"]
                for key, c in zip(
                    [
                        "AQADAAIBAAAAAAAAAAA=",
                        "AgACAAEAAAAAAgEAAAAAAAEAAQABAAAA",
                        "CAABAAEAAQACAQIAAQAAAAACAAEAAAABAgABAAACAAIAAQABAAECAQABAQEBAwACAQIAAgACAAEAAQABAAAA",
                        "AgACAAEAAAAAAgEAAAAAAAEAAQABAAAA",
                        "AgACAAEAAAAAAgEAAAAAAAEAAQABAAAA",
                    ],
                    res.json["children"],
                )
            )

    tiling = Tiling(
        obstructions=(
            GriddedPerm((0, 1), ((1, 5), (1, 5))),
            GriddedPerm((0, 1), ((2, 0), (2, 0))),
            GriddedPerm((0, 1), ((2, 0), (2, 2))),
            GriddedPerm((0, 1), ((2, 0), (6, 0))),
            GriddedPerm((0, 1), ((2, 2), (2, 2))),
            GriddedPerm((0, 1), ((3, 1), (3, 1))),
            GriddedPerm((0, 1), ((5, 3), (5, 3))),
            GriddedPerm((1, 0), ((1, 5), (1, 5))),
            GriddedPerm((1, 0), ((3, 1), (3, 1))),
            GriddedPerm((1, 0), ((4, 2), (4, 2))),
            GriddedPerm((1, 0), ((5, 3), (5, 3))),
            GriddedPerm((0, 2, 1), ((0, 4), (0, 4), (0, 4))),
            GriddedPerm((0, 2, 1), ((6, 0), (6, 0), (6, 0))),
        ),
        requirements=(
            (GriddedPerm((0,), ((1, 5),)),),
            (GriddedPerm((0,), ((2, 0),)),),
            (GriddedPerm((0,), ((3, 1),)),),
            (GriddedPerm((0,), ((5, 3),)),),
        ),
        assumptions=(),
    )
    _factor_t_helper(client, tiling, False)
    _factor_t_helper(client, tiling, True)


####################
# ColRow placement #
####################


def test_row_col_placement_invalid_type(client):
    for invalid_object in [
        None,
        1,
        -1.1,
        True,
        [],
        {},
        *[{"tiling": x for x in invalid_tilings()}],
        {"tiling": encode_tiling(Tiling())},
        {"tiling": encode_tiling(Tiling()), "dir": 1},
        {"tiling": encode_tiling(Tiling()), "dir": 1, "row": 1},
    ]:
        assert_code_and_mimetype(
            post(
                client,
                f"{_PATH_PREFIX}/rowcolplace",
                verify_wrap_invalid(invalid_object),
            ),
            code=400,
        )
        assert_code_and_mimetype(
            post(
                client,
                f"{_PATH_PREFIX}/rowcolplace",
                invalid_object,
            ),
            code=400,
        )
    valid_tiling = Tiling(
        obstructions=(
            GriddedPerm((0, 1), ((0, 0), (0, 0))),
            GriddedPerm((0, 1), ((0, 0), (0, 1))),
            GriddedPerm((0, 1), ((0, 0), (1, 0))),
            GriddedPerm((0, 1), ((0, 1), (0, 1))),
            GriddedPerm((0, 1), ((1, 0), (1, 0))),
        ),
        requirements=(),
        assumptions=(),
    )
    for data in (
        {"tiling": encode_tiling(valid_tiling), "dir": d, "row": True, "idx": 0}
        for d in invalid_dirs()
    ):
        data["verify"] = _EMPTY_VERIFY
        assert_code_and_mimetype(
            post(client, f"{_PATH_PREFIX}/rowcolplace", data), code=400
        )
    for data in (
        {"tiling": encode_tiling(valid_tiling), "dir": 1, "row": r, "idx": 0}
        for r in invalid_rows()
    ):
        data["verify"] = _EMPTY_VERIFY
        assert_code_and_mimetype(
            post(client, f"{_PATH_PREFIX}/rowcolplace", data), code=400
        )
    for data in (
        {"tiling": encode_tiling(valid_tiling), "dir": 1, "row": True, "idx": i}
        for i in invalid_idx()
    ):
        data["verify"] = _EMPTY_VERIFY
        assert_code_and_mimetype(
            post(client, f"{_PATH_PREFIX}/rowcolplace", data), code=400
        )
    assert_code_and_mimetype(
        post(
            client,
            f"{_PATH_PREFIX}/rowcolplace",
            {
                "tiling": encode_tiling(valid_tiling),
                "dir": 0,
                "row": True,
                "idx": 2,
                "verify": _EMPTY_VERIFY,
            },
        ),
        code=400,
    )
    assert_code_and_mimetype(
        post(
            client,
            f"{_PATH_PREFIX}/rowcolplace",
            {
                "tiling": encode_tiling(valid_tiling),
                "verify": _EMPTY_VERIFY,
                "dir": 0,
                "row": False,
                "idx": 2,
            },
        ),
        code=400,
    )
    assert_code_and_mimetype(
        post(
            client,
            f"{_PATH_PREFIX}/rowcolplace",
            {
                "tiling": encode_tiling(valid_tiling),
                "verify": _EMPTY_VERIFY,
                "dir": 0,
                "row": True,
                "idx": -1,
            },
        ),
        code=400,
    )


def test_row_col_placement_does_not_apply(client):
    for d, r in [(0, True), (1, False)]:
        res = post(
            client,
            f"{_PATH_PREFIX}/rowcolplace",
            {
                "tiling": encode_tiling(Tiling.from_string("123")),
                "verify": _EMPTY_VERIFY,
                "dir": d,
                "row": r,
                "idx": DIR_EAST,
            },
        )
        assert_code_and_mimetype(res, code=400)


def test_row_placement(client):
    t = Tiling(
        obstructions=(
            GriddedPerm((0, 1), ((0, 1), (1, 1))),
            GriddedPerm((1, 0), ((2, 2), (2, 2))),
            GriddedPerm((0, 2, 1), ((0, 1), (0, 1), (0, 1))),
            GriddedPerm((0, 2, 1), ((1, 1), (1, 1), (1, 1))),
            GriddedPerm((0, 2, 1), ((2, 0), (2, 0), (2, 0))),
            GriddedPerm((0, 2, 1), ((2, 0), (2, 2), (2, 0))),
        ),
        requirements=(),
        assumptions=(),
    )
    data = {
        "tiling": encode_tiling(t),
        "verify": _EMPTY_VERIFY,
        "row": True,
        "idx": 1,
        "dir": DIR_NORTH,
    }
    res = post(client, f"{_PATH_PREFIX}/rowcolplace", data)
    assert_code_and_mimetype(res)
    assert sorted(map(lambda c: c["key"], res.json["children"])) == sorted(
        [
            "AwACAQAAAQABAwACAQAAAAAAAAMAAgEAAAABAAAAAA==",
            "GQABAAAAAQAAAgEAAAMBAAEAAQABAQEAAQMBAAIAAQACAgEAAgMBAAMAAQADAgEAAwMBAAQBAQAEAgIAAQABAgECAAEAAQMBAgABAQIBAgIAAQIBAwECAQABAgECAgEABAMEAwMAAgEAAQABAAEDAAIBAgECAQIBAwACAQMBAwEDAQMAAgEEAAQABAADAAIBBAAEAwQAAQABAAEAAQI=",
            "EwABAAAAAQAAAgEAAAMBAAEAAQABAQEAAQMBAAIAAQACAgEAAgMBAAMBAQADAgIAAQABAgECAAEBAgECAgEAAQIBAgIBAAMDAwMDAAIBAAEAAQABAwACAQIBAgECAQMAAgEDAAMAAwADAAIBAwADAwMAAQABAAEAAQI=",
        ]
    )
    assert res.json["formal_step"] == "placing the topmost point in row 1"
    assert res.json["op"] == "+"


def test_row_placement_no_possiblities_for_index(client):
    t = (
        Tiling.from_string("132")
        .add_requirement(Perm((0,)), ((0, 0),))
        .place_point_in_cell((0, 0), DIR_NORTH)
    )
    data = {
        "tiling": encode_tiling(t),
        "verify": _EMPTY_VERIFY,
        "row": True,
        "idx": 1,
        "dir": DIR_NORTH,
    }
    res = post(client, f"{_PATH_PREFIX}/rowcolplace", data)
    assert_code_and_mimetype(res, code=400)


def test_row_placement_eq_rule(client):
    data = {
        "tiling": encode_tiling(
            Tiling(
                obstructions=(GriddedPerm((0, 1, 2), ((0, 0), (0, 0), (0, 0))),),
                requirements=((GriddedPerm((0,), ((0, 0),)),),),
                assumptions=(),
            )
        ),
        "verify": _EMPTY_VERIFY,
        "row": True,
        "idx": 0,
        "dir": DIR_NORTH,
    }
    res = post(client, f"{_PATH_PREFIX}/rowcolplace", data)
    assert_code_and_mimetype(res)
    assert res.json["op"] == "+"
    assert all(
        prop in res.json["original_rule"]
        for prop in ["children", "class_module", "rule_class", "strategy"]
    )
    assert (
        res.json["formal_step"]
        == "placing the topmost point in cell (0, 0) but only child and index 1 is non-empty"
    )
    assert (
        res.json["strategy"]["class_module"]
        == "tilings.strategies.requirement_placement"
    )
    assert res.json["strategy"]["strategy_class"] == "RequirementPlacementStrategy"
    assert res.json["strategy"]["gps"][0] == {"patt": [0], "pos": [[0, 0]]}
    assert (
        res.json["children"][0]["key"]
        == "CAABAAABAQABAAEAAgECAAEAAAAAAgABAQEBAQIBAAEBAQEDAAECAAACAAIAAwABAgIAAgACAAEAAQABAAEB"
    )


def test_col_placement(client):
    t = Tiling(
        obstructions=(
            GriddedPerm((0, 1), ((0, 1), (0, 1))),
            GriddedPerm((0, 1), ((0, 1), (0, 2))),
            GriddedPerm((0, 1), ((0, 2), (0, 2))),
            GriddedPerm((0, 1), ((1, 1), (1, 1))),
            GriddedPerm((0, 1), ((1, 1), (2, 1))),
            GriddedPerm((0, 1), ((2, 0), (2, 0))),
            GriddedPerm((0, 1), ((2, 0), (2, 1))),
            GriddedPerm((0, 1), ((2, 1), (2, 1))),
            GriddedPerm((0, 1, 2), ((1, 0), (1, 0), (1, 0))),
            GriddedPerm((0, 1, 2), ((1, 0), (1, 0), (1, 1))),
            GriddedPerm((0, 1, 2), ((1, 0), (1, 0), (2, 0))),
            GriddedPerm((0, 1, 2), ((1, 0), (1, 0), (2, 1))),
        ),
        requirements=(),
        assumptions=(),
    )
    data = {
        "tiling": encode_tiling(t),
        "verify": _EMPTY_VERIFY,
        "row": False,
        "idx": 1,
        "dir": DIR_WEST,
    }
    res = post(client, f"{_PATH_PREFIX}/rowcolplace", data)
    assert_code_and_mimetype(res)
    assert sorted(map(lambda c: c["key"], res.json["children"])) == sorted(
        [
            "CAABAAAAAQABAgIAAQABAAECAAEAAQACAgABAAIAAgIAAQEAAQACAAEBAAEBAgABAQEBAQAA",
            "IgABAAAAAQAAAQEAAAIBAAEAAQABAgEAAQMBAAEEAQACAQEAAgQBAAMBAQADBAIAAQADAAMCAAEAAwAEAgABAAQABAIAAQEBAQECAAECAgICAgABAgICAwIAAQICAwICAAECAgMDAgABAgMCAwIAAQIDAwMCAAEDAAMAAgABAwADAgIAAQMAAwMCAAEDAgMCAgABAwIDAwIAAQMDAwMCAQABAQEBAwABAgIAAgACAAMAAQICAAIAAgIDAAECAgACAAIDAwABAgIAAgADAAMAAQICAAIAAwIDAAECAgACAAMDAQABAAEAAQE=",
            "HQABAAAAAQAAAgEAAQABAAEBAQABAwEAAQQBAAICAQACAwEAAgQBAAMCAQADAwEAAwQCAAEAAQABAgABAAEAAwIAAQABAAQCAAEAAwADAgABAAMABAIAAQAEAAQCAAEBAgECAgABAgECAQIAAQIBAwECAAEDAAMAAgABAwADAQIAAQMBAwECAQABAgECAwABAgIAAgACAAMAAQICAAIAAgEDAAECAgACAAMAAwABAgIAAgADAQEAAQABAAEC",
        ]
    )
    assert res.json["formal_step"] == "placing the leftmost point in column 1"
    assert res.json["op"] == "+"


def test_col_placement_no_possiblities_for_index(client):
    t = Tiling(
        obstructions=(
            GriddedPerm((0, 1), ((0, 0), (2, 0))),
            GriddedPerm((0, 1), ((1, 1), (1, 1))),
            GriddedPerm((1, 0), ((1, 1), (1, 1))),
            GriddedPerm((0, 2, 1), ((0, 0), (0, 0), (0, 0))),
            GriddedPerm((0, 2, 1), ((2, 0), (2, 0), (2, 0))),
        ),
        requirements=((GriddedPerm((0,), ((1, 1),)),),),
        assumptions=(),
    )
    data = {
        "tiling": encode_tiling(t),
        "verify": _EMPTY_VERIFY,
        "row": False,
        "idx": 1,
        "dir": DIR_WEST,
    }
    res = post(client, f"{_PATH_PREFIX}/rowcolplace", data)
    assert_code_and_mimetype(res, code=400)


def test_col_placement_eq_rule(client):
    t = Tiling.from_string("123").add_requirement(Perm((0,)), ((0, 0),))
    data = {
        "tiling": encode_tiling(t),
        "verify": _EMPTY_VERIFY,
        "row": False,
        "idx": 0,
        "dir": DIR_WEST,
    }
    res = post(client, f"{_PATH_PREFIX}/rowcolplace", data)
    assert_code_and_mimetype(res)
    assert res.json["op"] == "+"
    assert all(
        prop in res.json["original_rule"]
        for prop in ["children", "class_module", "rule_class", "strategy"]
    )
    assert (
        res.json["formal_step"]
        == "placing the leftmost point in cell (0, 0) but only child and index 1 is non-empty"
    )
    assert (
        res.json["strategy"]["class_module"]
        == "tilings.strategies.requirement_placement"
    )
    assert res.json["strategy"]["strategy_class"] == "RequirementPlacementStrategy"
    assert res.json["strategy"]["gps"][0] == {"patt": [0], "pos": [[0, 0]]}
    assert (
        res.json["children"][0]["key"]
        == "CAABAAAAAQAAAgEAAQECAAEAAQABAgABAQIBAgIBAAABAAEDAAECAQABAAEAAwABAgEAAQABAgEAAQABAAAB"
    )
