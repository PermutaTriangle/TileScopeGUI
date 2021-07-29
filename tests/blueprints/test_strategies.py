import json
from typing import Any

import pytest
from permuta.misc import DIR_EAST, DIR_NORTH, DIR_SOUTH, DIR_WEST
from permuta.patterns.perm import Perm
from tilings import GriddedPerm, Tiling
from tilings.assumptions import TrackingAssumption

from tests.testutils.mocks.mock_client import client_generator
from tilescopegui.combinatorics.tilings import encode_tiling

_HEADERS = {"Accept": "application/json", "Content-Type": "application/json"}

_PATH_PREFIX = "/api/strategies"

_EMPTY_VERIFY: dict = {"strats": [], "basis": []}
_IE_LF_VERIFY: dict = {"strats": [0, 1], "basis": []}


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


def _replace_key(d, key, value):
    new_d = d.copy()
    new_d[key] = value
    return new_d


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


def _base_tiling_input_validation(client, path):
    for inv_tiling in invalid_tilings():
        res = post(client, path, inv_tiling)
        assert_code_and_mimetype(res, code=400)
        res = post(client, path, verify_wrap_invalid(inv_tiling))
        assert_code_and_mimetype(res, code=400)
    res = post(client, path, {"tiling": encode_tiling(Tiling())})
    assert_code_and_mimetype(res, code=400)
    res = post(
        client,
        path,
        {"tiling": encode_tiling(Tiling()), "verify": None},
    )
    assert_code_and_mimetype(res, code=400)


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


##################
# Cell insertion #
##################


def test_cell_insertion_invalid_input(client):
    for inv in [1, 1.1, False, "", [], {}, None]:
        assert_code_and_mimetype(
            post(client, f"{_PATH_PREFIX}/cellinsertion", inv), code=400
        )
    data = {
        "patt": "1",
        "verify": _EMPTY_VERIFY,
        "tiling": encode_tiling(Tiling.from_string("123")),
        "x": 0,
        "y": 0,
    }
    for invalid_patt in [1, -3.3, False, "", {}, [], None, "abc", "11", "134"]:
        assert_code_and_mimetype(
            post(
                client,
                f"{_PATH_PREFIX}/cellinsertion",
                _replace_key(
                    data,
                    "patt",
                    invalid_patt,
                ),
            ),
            code=400,
        )
    assert_code_and_mimetype(
        post(
            client,
            f"{_PATH_PREFIX}/cellinsertion",
            _replace_key(
                data,
                "verify",
                {"strats": 1, "basis": 2},
            ),
        ),
        code=400,
    )
    for invalid_tiling in [-1, 2.2, False, None, "-" * 100, [], {}]:
        assert_code_and_mimetype(
            post(
                client,
                f"{_PATH_PREFIX}/cellinsertion",
                _replace_key(
                    data,
                    "tiling",
                    invalid_tiling,
                ),
            ),
            code=400,
        )
    for invalid_coord in [-1, 1, 1.1, "", None, [], {}]:
        assert_code_and_mimetype(
            post(
                client,
                f"{_PATH_PREFIX}/cellinsertion",
                _replace_key(
                    data,
                    "x",
                    invalid_coord,
                ),
            ),
            code=400,
        )
        assert_code_and_mimetype(
            post(
                client,
                f"{_PATH_PREFIX}/cellinsertion",
                _replace_key(
                    data,
                    "y",
                    invalid_coord,
                ),
            ),
            code=400,
        )


def test_cell_insertion_tautology(client):
    data = {
        "patt": "1",
        "verify": _EMPTY_VERIFY,
        "tiling": encode_tiling(
            Tiling.from_string("123")
            .add_requirement(Perm((0,)), ((0, 0),))
            .place_point_in_cell((0, 0), DIR_NORTH)
        ),
        "x": 0,
        "y": 1,
    }
    res = post(client, f"{_PATH_PREFIX}/cellinsertion", data)
    assert_code_and_mimetype(res, code=400)


def test_cell_insertion(client):
    data = {
        "patt": "1",
        "verify": _EMPTY_VERIFY,
        "tiling": encode_tiling(
            Tiling.from_string("123")
            .add_requirement(Perm((0,)), ((0, 0),))
            .place_point_in_cell((0, 0), DIR_NORTH)
        ),
        "x": 0,
        "y": 0,
    }
    res = post(client, f"{_PATH_PREFIX}/cellinsertion", data)
    assert_code_and_mimetype(res)
    assert len(res.json) == 6
    assert all(
        k in res.json
        for k in (
            "children",
            "class_module",
            "formal_step",
            "op",
            "rule_class",
            "strategy",
        )
    )
    assert res.json["op"] == "+"
    assert res.json["formal_step"] == "insert 0 in cell (0, 0)"
    assert sorted(map(lambda c: c["key"], res.json["children"])) == sorted(
        [
            "BQABAAAAAQABAQIAAQABAAECAQAAAQABAwABAgEAAQABAAEAAQABAAAB",
            "CAABAAABAQABAAEAAgECAAEAAAAAAgABAQEBAQIBAAEBAQEDAAECAAACAAIAAwABAgIAAgACAAIAAQABAAAAAQABAAEB",
        ]
    )


#####################
# RowCol Separation #
#####################


def test_row_col_separation_invalid_input(client):
    _base_tiling_input_validation(client, f"{_PATH_PREFIX}/rowcolsep")


def test_row_col_seperation_strategy_does_not_apply(client):
    res = post(
        client,
        f"{_PATH_PREFIX}/rowcolsep",
        {"tiling": encode_tiling(Tiling.from_string("132")), "verify": _EMPTY_VERIFY},
    )
    assert_code_and_mimetype(res, code=400)


def test_row_col_seperation(client):
    tiling = (
        Tiling.from_string("132")
        .add_requirement(Perm((0,)), ((0, 0),))
        .place_point_in_cell((0, 0), DIR_NORTH)
    )
    for i, ver in enumerate([_EMPTY_VERIFY, _IE_LF_VERIFY]):
        res = post(
            client,
            f"{_PATH_PREFIX}/rowcolsep",
            {"tiling": encode_tiling(tiling), "verify": ver},
        )
        assert_code_and_mimetype(res)
        assert len(res.json) == 6
        assert all(
            k in res.json
            for k in (
                "children",
                "class_module",
                "formal_step",
                "op",
                "rule_class",
                "strategy",
            )
        )
        assert res.json["op"] == "+"
        assert res.json["formal_step"] == "row and column separation"
        assert len(res.json["children"])
        child = res.json["children"][0]
        assert (
            child["key"]
            == "CgABAAAAAQAAAgEAAQABAAEBAQACAQEAAgICAAEBAgECAgEAAQIBAgMAAgEAAQABAAEDAAIBAgACAAIAAQABAAEAAQI="
        )
        if i == 0:
            assert child["verified"] is None
        else:
            assert child["verified"] is not None
            assert child["verified"]["formal_step"] == "tiling is locally factorable"


#########################
# Requirement placement #
#########################


def test_req_placement_invalid_input(client):
    for invalid in [1, 3.3, "", {}, [], None]:
        assert_code_and_mimetype(
            post(
                client,
                f"{_PATH_PREFIX}/reqplace",
                invalid,
            ),
            code=400,
        )
    data = {
        "tiling": encode_tiling(
            Tiling.from_string("123").add_requirement(Perm((0,)), ((0, 0),))
        ),
        "verify": _EMPTY_VERIFY,
        "x": 0,
        "y": 0,
        "dir": DIR_NORTH,
        "idx": 0,
    }
    for inv_tiling in invalid_tilings():
        assert_code_and_mimetype(
            post(
                client,
                f"{_PATH_PREFIX}/reqplace",
                _replace_key(data, "tiling", inv_tiling),
            ),
            code=400,
        )
    assert_code_and_mimetype(
        post(
            client,
            f"{_PATH_PREFIX}/reqplace",
            _replace_key(data, "verify", None),
        ),
        code=400,
    )
    for inv_coord in [-1, 1, 3.3, "abc", [], {}, None]:
        assert_code_and_mimetype(
            post(
                client,
                f"{_PATH_PREFIX}/reqplace",
                _replace_key(data, "x", inv_coord),
            ),
            code=400,
        )
        assert_code_and_mimetype(
            post(
                client,
                f"{_PATH_PREFIX}/reqplace",
                _replace_key(data, "y", inv_coord),
            ),
            code=400,
        )
    for invalid_dir in invalid_dirs():
        assert_code_and_mimetype(
            post(
                client,
                f"{_PATH_PREFIX}/reqplace",
                _replace_key(data, "dir", invalid_dir),
            ),
            code=400,
        )
    for inv_idx in invalid_idx() + [1]:
        assert_code_and_mimetype(
            post(
                client,
                f"{_PATH_PREFIX}/reqplace",
                _replace_key(data, "idx", inv_idx),
            ),
            code=400,
        )
    # TODO: Remove this if we improve UI to select indices of any req
    # In that case, idx should probably be an array and this test needs refactoring
    assert_code_and_mimetype(
        post(
            client,
            f"{_PATH_PREFIX}/reqplace",
            _replace_key(
                data,
                "tiling",
                encode_tiling(
                    Tiling.from_string("132")
                    .add_requirement(Perm((0, 1)), ((0, 0), (0, 0)))
                    .add_requirement(Perm((1, 0)), ((0, 0), (0, 0)))
                ),
            ),
        ),
        code=400,
    )


def test_req_placement_tautology(client):
    t = Tiling.from_string("12_21").add_requirement(Perm((0,)), ((0, 0),))
    data = {
        "tiling": encode_tiling(t),
        "verify": _EMPTY_VERIFY,
        "x": 0,
        "y": 0,
        "dir": DIR_NORTH,
        "idx": 0,
    }
    assert_code_and_mimetype(
        post(client, f"{_PATH_PREFIX}/reqplace", data),
        code=400,
    )


def test_req_placement(client):
    t = Tiling.from_string("132").add_requirement(Perm((0,)), ((0, 0),))
    data = {
        "tiling": encode_tiling(t),
        "verify": _EMPTY_VERIFY,
        "x": 0,
        "y": 0,
        "dir": DIR_NORTH,
        "idx": 0,
    }
    res = post(client, f"{_PATH_PREFIX}/reqplace", data)
    assert_code_and_mimetype(res)
    assert len(res.json) == 7
    assert all(
        k in res.json
        for k in [
            "children",
            "class_module",
            "formal_step",
            "op",
            "original_rule",
            "rule_class",
            "strategy",
        ]
    )
    child_key = "CAABAAABAQABAAEAAgECAAEAAAIAAgABAQEBAQIBAAEBAQEDAAIBAAAAAAAAAwACAQIAAgACAAEAAQABAAEB"
    assert (
        len(res.json["children"]) == 1 and res.json["children"][0]["key"] == child_key
    )
    assert res.json["op"] == "+"
    assert len(res.json["original_rule"]["children"]) == 2
    assert sorted(res.json["original_rule"]["children"]) == sorted(
        [child_key, "AQAAAAA="]
    )
    assert (
        res.json["formal_step"]
        == "placing the topmost point in cell (0, 0) but only child and index 1 is non-empty"
    )


##################
# Add assumption #
##################


def test_add_assumption_invalid_input(client):
    tiling = Tiling(
        obstructions=(
            GriddedPerm((0, 1), ((0, 0), (0, 0))),
            GriddedPerm((0, 1), ((0, 0), (1, 0))),
            GriddedPerm((0, 1), ((1, 0), (1, 0))),
            GriddedPerm((0, 1, 2), ((0, 0), (2, 0), (2, 0))),
            GriddedPerm((0, 1, 2), ((1, 0), (2, 0), (2, 0))),
            GriddedPerm((0, 1, 2), ((2, 0), (2, 0), (2, 0))),
        ),
        requirements=(),
        assumptions=(),
    )
    data = {
        "tiling": encode_tiling(tiling),
        "verify": _EMPTY_VERIFY,
        "pos": [[1, 0], [2, 0]],
    }
    for invalid_data in [False, 1, 1.1, "", [], {}, None]:
        assert_code_and_mimetype(
            post(client, f"{_PATH_PREFIX}/addassumption", invalid_data), code=400
        )
    for inv_t in invalid_tilings():
        assert_code_and_mimetype(
            post(
                client,
                f"{_PATH_PREFIX}/addassumption",
                _replace_key(data, "tiling", inv_t),
            ),
            code=400,
        )
    assert_code_and_mimetype(
        post(
            client, f"{_PATH_PREFIX}/addassumption", _replace_key(data, "verify", None)
        ),
        code=400,
    )
    for inv_p in [None, [], {}, 1, 1.1, "", None, [[1]], [["1", "b"]], [[50, 50]]]:
        assert_code_and_mimetype(
            post(
                client,
                f"{_PATH_PREFIX}/addassumption",
                _replace_key(data, "pos", inv_p),
            ),
            code=400,
        )


def test_add_assumption_does_not_apply(client):
    tiling = Tiling(
        obstructions=(
            GriddedPerm((0, 1), ((0, 0), (0, 0))),
            GriddedPerm((0, 1), ((0, 0), (1, 0))),
            GriddedPerm((0, 1), ((1, 0), (1, 0))),
            GriddedPerm((0, 1, 2), ((0, 0), (2, 0), (2, 0))),
            GriddedPerm((0, 1, 2), ((1, 0), (2, 0), (2, 0))),
            GriddedPerm((0, 1, 2), ((2, 0), (2, 0), (2, 0))),
        ),
        requirements=(),
        assumptions=(),
    ).add_assumption(TrackingAssumption([GriddedPerm.single_cell((0,), (0, 0))]))
    data = {
        "tiling": encode_tiling(tiling),
        "verify": _EMPTY_VERIFY,
        "pos": [[0, 0]],
    }
    assert_code_and_mimetype(
        post(client, f"{_PATH_PREFIX}/addassumption", data), code=400
    )


def test_add_assumption(client):
    tiling = Tiling(
        obstructions=(
            GriddedPerm((0, 1), ((0, 0), (0, 0))),
            GriddedPerm((0, 1), ((0, 0), (1, 0))),
            GriddedPerm((0, 1), ((1, 0), (1, 0))),
            GriddedPerm((0, 1, 2), ((0, 0), (2, 0), (2, 0))),
            GriddedPerm((0, 1, 2), ((1, 0), (2, 0), (2, 0))),
            GriddedPerm((0, 1, 2), ((2, 0), (2, 0), (2, 0))),
        ),
        requirements=(),
        assumptions=(),
    )
    data = {
        "tiling": encode_tiling(tiling),
        "verify": _EMPTY_VERIFY,
        "pos": [[0, 0]],
    }
    res = post(client, f"{_PATH_PREFIX}/addassumption", data)
    assert_code_and_mimetype(res)
    assert len(res.json) == 6
    assert all(
        k in res.json
        for k in [
            "children",
            "class_module",
            "formal_step",
            "op",
            "rule_class",
            "strategy",
        ]
    )
    assert len(res.json["children"]) == 1
    assert (
        res.json["children"][0]["key"]
        == "BgACAAEAAAAAAgABAAABAAIAAQEAAQADAAECAAACAAIAAwABAgEAAgACAAMAAQICAAIAAgAAAAEAAAEAAQAAAA=="
    )
    assert res.json["op"] == "?"
    assert (
        res.json["formal_step"]
        == "adding the assumption 'can count points in cell (0, 0)'"
    )


##########
# Fusion #
##########


def test_fusion_invalid_input(client):
    tiling = Tiling(
        obstructions=(
            GriddedPerm((0, 1), ((0, 0), (0, 0))),
            GriddedPerm((0, 1), ((0, 0), (1, 0))),
            GriddedPerm((0, 1), ((1, 0), (1, 0))),
            GriddedPerm((0, 1, 2), ((0, 0), (2, 0), (2, 0))),
            GriddedPerm((0, 1, 2), ((1, 0), (2, 0), (2, 0))),
            GriddedPerm((0, 1, 2), ((2, 0), (2, 0), (2, 0))),
        ),
        requirements=(),
        assumptions=(),
    ).add_assumption(TrackingAssumption([GriddedPerm.single_cell((0,), (0, 0))]))
    data = {
        "tiling": encode_tiling(tiling),
        "verify": _EMPTY_VERIFY,
        "row": False,
        "idx": 0,
    }
    for invalid_data in [False, 1, 1.1, "", [], {}, None]:
        assert_code_and_mimetype(
            post(client, f"{_PATH_PREFIX}/fusion", invalid_data), code=400
        )
    for inv_t in invalid_tilings():
        assert_code_and_mimetype(
            post(
                client,
                f"{_PATH_PREFIX}/fusion",
                _replace_key(data, "tiling", inv_t),
            ),
            code=400,
        )
    assert_code_and_mimetype(
        post(client, f"{_PATH_PREFIX}/fusion", _replace_key(data, "verify", None)),
        code=400,
    )
    for inv_r in [None, [], {}, 55, 1.1, ""]:
        assert_code_and_mimetype(
            post(
                client,
                f"{_PATH_PREFIX}/fusion",
                _replace_key(data, "row", inv_r),
            ),
            code=400,
        )
    for inv_idx in [None, [], {}, 5, -1, "asdf"]:
        data2 = _replace_key(data, "idx", inv_idx)
        assert_code_and_mimetype(
            post(
                client,
                f"{_PATH_PREFIX}/fusion",
                data2,
            ),
            code=400,
        )
        assert_code_and_mimetype(
            post(
                client,
                f"{_PATH_PREFIX}/fusion",
                _replace_key(data2, "row", True),
            ),
            code=400,
        )


def test_fusion_strategy_does_not_apply(client):
    tiling = Tiling(
        obstructions=(
            GriddedPerm((0, 1), ((0, 0), (0, 0))),
            GriddedPerm((0, 1), ((0, 0), (1, 0))),
            GriddedPerm((0, 1), ((1, 0), (1, 0))),
            GriddedPerm((0, 1, 2), ((0, 0), (2, 0), (2, 0))),
            GriddedPerm((0, 1, 2), ((1, 0), (2, 0), (2, 0))),
            GriddedPerm((0, 1, 2), ((2, 0), (2, 0), (2, 0))),
        ),
        requirements=(),
        assumptions=(),
    ).add_assumption(TrackingAssumption([GriddedPerm.single_cell((0,), (0, 0))]))
    data = {
        "tiling": encode_tiling(tiling),
        "verify": _EMPTY_VERIFY,
        "row": False,
        "idx": 1,
    }
    assert_code_and_mimetype(
        post(client, f"{_PATH_PREFIX}/fusion", data),
        code=400,
    )


def test_fusion(client):
    tiling = Tiling(
        obstructions=(
            GriddedPerm((0, 1), ((0, 0), (0, 0))),
            GriddedPerm((0, 1), ((0, 0), (1, 0))),
            GriddedPerm((0, 1), ((1, 0), (1, 0))),
            GriddedPerm((0, 1, 2), ((0, 0), (2, 0), (2, 0))),
            GriddedPerm((0, 1, 2), ((1, 0), (2, 0), (2, 0))),
            GriddedPerm((0, 1, 2), ((2, 0), (2, 0), (2, 0))),
        ),
        requirements=(),
        assumptions=(),
    ).add_assumption(TrackingAssumption([GriddedPerm.single_cell((0,), (0, 0))]))
    data = {
        "tiling": encode_tiling(tiling),
        "verify": _EMPTY_VERIFY,
        "row": False,
        "idx": 0,
    }
    res = post(client, f"{_PATH_PREFIX}/fusion", data)
    assert_code_and_mimetype(res)
    assert len(res.json) == 6
    assert all(
        k in res.json
        for k in [
            "children",
            "formal_step",
            "class_module",
            "op",
            "rule_class",
            "strategy",
        ]
    )
    assert res.json["op"] == "⚮"
    assert res.json["formal_step"] == "fuse columns 0 and 1"
    assert len(res.json["children"]) == 1
    assert (
        res.json["children"][0]["key"]
        == "AwACAAEAAAAAAwABAgAAAQABAAMAAQIBAAEAAQAAAAEAAAEAAQAAAA=="
    )


##########################
# Obstruction Transivity #
##########################


def test_obstruction_transivity_invalid_inp(client):
    _base_tiling_input_validation(client, f"{_PATH_PREFIX}/obstrans")


def test_obstruction_transivity_does_not_apply(client):
    res = post(
        client,
        f"{_PATH_PREFIX}/obstrans",
        verify_wrap_tiling(Tiling.from_string("123")),
    )
    assert_code_and_mimetype(res, code=400)


def test_obstruction_transivity(client):
    res = post(
        client,
        f"{_PATH_PREFIX}/obstrans",
        verify_wrap_tiling(
            Tiling(
                obstructions=[
                    GriddedPerm((0, 1), [(0, 0), (1, 0)]),
                    GriddedPerm((0, 1), [(1, 0), (2, 0)]),
                ],
                requirements=[[GriddedPerm((0,), [(1, 0)])]],
            )
        ),
    )
    assert_code_and_mimetype(res)
    assert len(res.json) == 6
    assert all(
        k in res.json
        for k in [
            "children",
            "formal_step",
            "class_module",
            "op",
            "rule_class",
            "strategy",
        ]
    )
    assert res.json["op"] == "+"
    assert res.json["formal_step"] == "added the obstructions {01: (0, 0), (2, 0)}"
    assert len(res.json["children"]) == 1
    assert (
        res.json["children"][0]["key"] == "AwACAAEAAAEAAgABAAACAAIAAQEAAgABAAEAAQABAA=="
    )


########################
# Rearrange assumption #
########################


def test_rearrange_assumption_invalid_input(client):
    _base_tiling_input_validation(client, f"{_PATH_PREFIX}/rearrangeassumption")


def test_rearrange_assumption_does_not_apply(client):
    res = post(
        client,
        f"{_PATH_PREFIX}/rearrangeassumption",
        verify_wrap_tiling(Tiling.from_string("123")),
    )
    assert_code_and_mimetype(res, code=400)


def test_rearrange_assumption(client):
    tiling = (
        Tiling(
            obstructions=(
                GriddedPerm((0, 1), ((0, 0), (0, 0))),
                GriddedPerm((0, 1, 2), ((0, 0), (1, 0), (1, 0))),
                GriddedPerm((0, 1, 2), ((1, 0), (1, 0), (1, 0))),
            ),
            requirements=(),
            assumptions=(),
        )
        .add_assumption(TrackingAssumption([GriddedPerm.single_cell((0,), (0, 0))]))
        .add_assumption(
            TrackingAssumption(
                [
                    GriddedPerm.single_cell((0,), (0, 0)),
                    GriddedPerm.single_cell((0,), (1, 0)),
                ]
            )
        )
    )
    res = post(
        client,
        f"{_PATH_PREFIX}/rearrangeassumption",
        verify_wrap_tiling(tiling),
    )
    assert_code_and_mimetype(res)
    assert len(res.json) == 6
    assert all(
        k in res.json
        for k in [
            "children",
            "formal_step",
            "class_module",
            "op",
            "rule_class",
            "strategy",
        ]
    )
    assert res.json["op"] == "?"
    assert (
        res.json["formal_step"]
        == "rearranging the assumption can count points in cells (0, 0), (1, 0) and can count points in cell (0, 0)"
    )
    assert len(res.json["children"]) == 1
    assert (
        res.json["children"][0]["key"]
        == "AwACAAEAAAAAAwABAgAAAQABAAMAAQIBAAEAAQAAAAIAAAEAAQAAAAABAAEAAQA="
    )


###########
# Sliding #
###########
def test_sliding_invalid_input(client):
    data = {
        "tiling": encode_tiling(
            Tiling(
                obstructions=(
                    GriddedPerm((0, 1), ((2, 0), (2, 0))),
                    GriddedPerm((0, 1, 2), ((0, 0), (0, 0), (0, 0))),
                    GriddedPerm((0, 1, 2), ((0, 0), (0, 0), (1, 0))),
                    GriddedPerm((0, 1, 2), ((0, 0), (0, 0), (2, 0))),
                    GriddedPerm((0, 1, 2), ((0, 0), (1, 0), (1, 0))),
                    GriddedPerm((0, 1, 2), ((0, 0), (1, 0), (2, 0))),
                    GriddedPerm((0, 1, 2), ((1, 0), (1, 0), (1, 0))),
                    GriddedPerm((0, 1, 2), ((1, 0), (1, 0), (2, 0))),
                ),
                requirements=(),
                assumptions=(),
            )
        ),
        "verify": _EMPTY_VERIFY,
        "idx1": 1,
        "idx2": 2,
    }
    for invalid_data in [None, [], {}, "x", 1, 0.3]:
        assert_code_and_mimetype(
            post(
                client,
                f"{_PATH_PREFIX}/sliding",
                invalid_data,
            ),
            code=400,
        )
    for inv_t in invalid_tilings():
        assert_code_and_mimetype(
            post(
                client,
                f"{_PATH_PREFIX}/sliding",
                _replace_key(data, "tiling", inv_t),
            ),
            code=400,
        )
    assert_code_and_mimetype(
        post(
            client,
            f"{_PATH_PREFIX}/sliding",
            _replace_key(data, "verify", None),
        ),
        code=400,
    )
    for invalid_idx in [-1, 5, None, {}, [], "abc"]:
        assert_code_and_mimetype(
            post(
                client,
                f"{_PATH_PREFIX}/sliding",
                _replace_key(data, "idx1", invalid_idx),
            ),
            code=400,
        )
        assert_code_and_mimetype(
            post(
                client,
                f"{_PATH_PREFIX}/sliding",
                _replace_key(data, "idx1", invalid_idx),
            ),
            code=400,
        )


def test_sliding_does_not_apply(client):
    tiling = Tiling(
        obstructions=(
            GriddedPerm((0, 3, 1, 2), ((0, 0), (1, 0), (1, 0), (1, 0))),
            GriddedPerm((0, 4, 3, 1, 2), ((0, 0), (0, 0), (0, 0), (0, 0), (0, 0))),
            GriddedPerm((0, 4, 3, 1, 2), ((0, 0), (0, 0), (0, 0), (0, 0), (1, 0))),
            GriddedPerm((0, 4, 3, 1, 2), ((0, 0), (0, 0), (0, 0), (1, 0), (1, 0))),
            GriddedPerm((0, 4, 3, 1, 2), ((1, 0), (1, 0), (1, 0), (1, 0), (1, 0))),
        ),
        requirements=(),
        assumptions=(),
    )
    data = {
        "tiling": encode_tiling(tiling),
        "verify": _EMPTY_VERIFY,
        "idx1": 0,
        "idx2": 1,
    }
    assert_code_and_mimetype(
        post(
            client,
            f"{_PATH_PREFIX}/sliding",
            data,
        ),
        code=400,
    )


def test_sliding(client):
    t = Tiling(
        obstructions=(
            GriddedPerm((0, 1), ((2, 0), (2, 0))),
            GriddedPerm((0, 1, 2), ((0, 0), (0, 0), (0, 0))),
            GriddedPerm((0, 1, 2), ((0, 0), (0, 0), (1, 0))),
            GriddedPerm((0, 1, 2), ((0, 0), (0, 0), (2, 0))),
            GriddedPerm((0, 1, 2), ((0, 0), (1, 0), (1, 0))),
            GriddedPerm((0, 1, 2), ((0, 0), (1, 0), (2, 0))),
            GriddedPerm((0, 1, 2), ((1, 0), (1, 0), (1, 0))),
            GriddedPerm((0, 1, 2), ((1, 0), (1, 0), (2, 0))),
        ),
        requirements=(),
        assumptions=(),
    )
    data = {
        "tiling": encode_tiling(t),
        "verify": _EMPTY_VERIFY,
        "idx1": 1,
        "idx2": 2,
    }
    res = post(client, f"{_PATH_PREFIX}/sliding", data)
    assert_code_and_mimetype(res)
    assert len(res.json) == 6
    assert all(
        k in res.json
        for k in [
            "children",
            "formal_step",
            "class_module",
            "op",
            "rule_class",
            "strategy",
        ]
    )
    assert res.json["op"] == "+"
    assert res.json["formal_step"] == "slide 1 through 2 after applying no symmetry"
    assert len(res.json["children"]) == 1
    assert (
        res.json["children"][0]["key"]
        == "CAACAAEBAAEAAwABAgAAAAAAAAMAAQIAAAAAAQADAAECAAAAAAIAAwABAgAAAQACAAMAAQIAAAIAAgADAAECAQACAAIAAwABAgIAAgACAAAA"
    )


##############
# Symmetries #
##############


def test_symmetries_invalid_input(client):
    for invalid_data in [0, 1.1, "asdf", [], {}, None]:
        assert_code_and_mimetype(
            post(client, f"{_PATH_PREFIX}/symmetry", invalid_data), code=400
        )
    data = {
        "tiling": encode_tiling(Tiling.from_string("1342")),
        "verify": _EMPTY_VERIFY,
        "symmetry": 5,
    }
    for inv_t in invalid_tilings():
        assert_code_and_mimetype(
            post(
                client, f"{_PATH_PREFIX}/symmetry", _replace_key(data, "tiling", inv_t)
            ),
            code=400,
        )
    assert_code_and_mimetype(
        post(client, f"{_PATH_PREFIX}/symmetry", _replace_key(data, "verify", None)),
        code=400,
    )
    for invalid_sym in [-1, 8, 0.2, "abc", {}, [], None]:
        assert_code_and_mimetype(
            post(
                client,
                f"{_PATH_PREFIX}/symmetry",
                _replace_key(data, "symmetry", invalid_sym),
            ),
            code=400,
        )


def test_symmetries_tautology(client):
    data = {
        "tiling": encode_tiling(Tiling.from_string("1234")),
        "verify": _EMPTY_VERIFY,
        "symmetry": 2,
    }
    assert_code_and_mimetype(
        post(client, f"{_PATH_PREFIX}/symmetry", data),
        code=400,
    )


def test_symmetries(client):
    def _get_all_sym_res():
        for i in range(1, 8):
            data = {
                "tiling": encode_tiling(Tiling.from_string("1342")),
                "verify": _EMPTY_VERIFY,
                "symmetry": i,
            }
            yield post(client, f"{_PATH_PREFIX}/symmetry", data)

    expected_formal_steps = [
        "rotate the tiling 90 degrees clockwise",
        "rotate the tiling 180 degrees clockwise",
        "rotate the tiling 270 degrees clockwise",
        "reverse of the tiling",
        "complement of the tiling",
        "inverse of the tiling",
        "antidiagonal of the tiling",
    ]
    expected_childs = ["4132", "3124", "3241", "2431", "4213", "1423", "2314"]
    for res, fs, c in zip(_get_all_sym_res(), expected_formal_steps, expected_childs):
        assert_code_and_mimetype(res)
        assert len(res.json) == 6
        assert all(
            k in res.json
            for k in [
                "children",
                "formal_step",
                "class_module",
                "op",
                "rule_class",
                "strategy",
            ]
        )
        assert res.json["op"] == "+"
        assert res.json["formal_step"] == fs
        assert len(res.json["children"]) == 1
        assert res.json["children"][0]["key"] == encode_tiling(Tiling.from_string(c))
