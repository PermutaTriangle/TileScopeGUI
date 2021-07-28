import pytest
from permuta.patterns.perm import Perm

from tilescopegui.combinatorics import VerificationTactics


def _make_inp(strats=None, basis=None):
    d = {}
    if strats is not None:
        d["strats"] = strats
    if basis is not None:
        d["basis"] = basis
    return d


def test_from_response_dictionary_invalid_input():
    for invalid in [
        None,
        1,
        1.1,
        False,
        "str",
        [],
        {},
        _make_inp(strats=1),
        _make_inp(basis=1),
        _make_inp(strats=1, basis=[]),
        _make_inp(strats=[], basis=1),
        _make_inp(strats=[0, "x"], basis=["x"]),
        _make_inp(strats=[0, 1], basis=[1, 2]),
    ]:
        with pytest.raises(ValueError):
            VerificationTactics.from_response_dictionary(invalid)


def test_from_response_dictionary_no_basis():
    v_tact = VerificationTactics.from_response_dictionary(
        _make_inp([0, 1, 2, 3, 4], [])
    )
    assert v_tact.insertion_encodable()
    assert v_tact.locally_factorable()
    assert v_tact.short_obstruction()
    assert not v_tact.one_by_one()
    assert not v_tact.subclass()
    assert v_tact.get_basis() == ()


def test_from_response_dictionary_with_basis():
    v_tact = VerificationTactics.from_response_dictionary(
        _make_inp([0, 1, 2, 3, 4], ["3124", "1324"])
    )
    assert v_tact.insertion_encodable()
    assert v_tact.locally_factorable()
    assert v_tact.short_obstruction()
    assert v_tact.one_by_one()
    assert v_tact.subclass()
    assert set(v_tact.get_basis()) == set(
        [Perm.to_standard("3124"), Perm.to_standard("1324")]
    )


def test_from_response_dictionary_for_root():
    v_tact = VerificationTactics.from_response_dictionary_for_root(
        _make_inp([0, 1, 2, 3, 4], ["3124", "1324"])
    )
    assert v_tact.insertion_encodable()
    assert v_tact.locally_factorable()
    assert v_tact.short_obstruction()
    assert not v_tact.one_by_one()
    assert not v_tact.subclass()
    assert set(v_tact.get_basis()) == set(
        [Perm.to_standard("3124"), Perm.to_standard("1324")]
    )
