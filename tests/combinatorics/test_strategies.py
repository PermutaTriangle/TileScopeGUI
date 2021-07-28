from permuta.misc import DIR_NORTH
from permuta.patterns.perm import Perm
from tilings import tiling
from tilings.griddedperm import GriddedPerm
from tilings.tiling import Tiling

from tilescopegui.combinatorics import VerificationTactics, verify_to_json


def tacts(strats, basis):
    return VerificationTactics.from_response_dictionary(
        {"strats": strats, "basis": basis}
    )


def base():
    return tacts([], [])


def all_tacts(basis):
    return tacts(list(range(5)), basis)


def assert_keys(d, formal_step):
    assert len(d) == 4
    assert all(
        k in d for k in ("class_module", "rule_class", "strategy", "formal_step")
    )
    assert d["formal_step"] == formal_step


def test_not_verified():
    tiling = (
        Tiling.from_string("1324")
        .add_requirement(Perm((0,)), ((0, 0),))
        .place_point_in_cell((0, 0), DIR_NORTH)
    )
    assert verify_to_json(tiling, all_tacts(["15234"])) is None


def test_atom_verified():
    tiling = (
        Tiling.from_string("12")
        .add_obstruction(Perm((1, 0)), ((0, 0), (0, 0)))
        .add_requirement(Perm((0,)), ((0, 0),))
    )
    ver_json = verify_to_json(tiling, all_tacts(["123"]))
    assert_keys(ver_json, "is atom")


def test_insertion_encodable_verified():
    tiling = Tiling.from_string("123_321")
    ver_json = verify_to_json(tiling, all_tacts(["123"]))
    assert_keys(ver_json, "tiling has a regular insertion encoding")


def test_locally_factorable_verified():
    def gps():
        for i in range(4):
            yield GriddedPerm(Perm((0, 1)), ((i, i), (i, i)))

    tiling = Tiling(obstructions=tuple(gps()))
    ver_json = verify_to_json(tiling, all_tacts(["123"]))
    assert_keys(ver_json, "tiling is locally factorable")


def test_short_obs_verified():
    def gps():
        for i in range(4):
            yield GriddedPerm(
                Perm.from_string("021"),
                ((0, 0),) * i + ((1, 0),) * (3 - i),
            )

    tiling = Tiling(obstructions=tuple(gps()))
    ver_json = verify_to_json(tiling, all_tacts(["123"]))
    assert_keys(ver_json, "tiling has short (length <= 3) crossing obstructions")


def test_one_by_one_verified():
    tiling = Tiling.from_string("0123456")
    ver_json = verify_to_json(tiling, all_tacts(["123"]))
    assert_keys(ver_json, "tiling is a subclass of the original tiling")
    assert ver_json["strategy"]["strategy_class"] == "OneByOneVerificationStrategy"


def test_subclass_verified():
    tiling = (
        Tiling.from_string("0123")
        .add_requirement(Perm((0,)), ((0, 0),))
        .place_point_in_cell((0, 0), DIR_NORTH)
    )
    ver_json = verify_to_json(tiling, all_tacts(["1234"]))
    assert_keys(ver_json, "tiling is contained in the subclass Av(0123)")
