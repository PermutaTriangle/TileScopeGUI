import tilings.strategies as strats
from permuta.misc import DIR_NORTH
from permuta.patterns.perm import Perm
from tilings.tiling import Tiling

from tilescopegui.combinatorics import (
    VerificationTactics,
    original_rule_as_json,
    rule_as_json,
)


def base_ver():
    return VerificationTactics.from_response_dictionary({"strats": [], "basis": []})


def test_rule_as_json():
    tiling = Tiling.from_string("1324")
    rules = list(
        strats.RowAndColumnPlacementFactory(True, False, False, False, (DIR_NORTH,))(
            tiling
        )
    )
    assert len(rules) == 1
    (rule,) = rules
    expected_child_verification = [True, False]

    rule_json = rule_as_json(rule, base_ver())
    assert rule_json.pop("class_module") == rule.__class__.__module__
    assert rule_json.pop("rule_class") == rule.__class__.__name__
    assert rule_json.pop("strategy") == rule.strategy.to_jsonable()
    children = rule_json.pop("children")
    assert len(children) == 2
    for child, should_be_verified in zip(children, expected_child_verification):
        if should_be_verified:
            assert child["verified"] is not None
        else:
            assert child["verified"] is None
    assert rule_json.pop("formal_step") == rule.formal_step
    assert rule_json.pop("op") == rule.get_op_symbol()
    assert len(rule_json) == 0


def test_original_rule_as_json():
    tiling = Tiling.from_string("1324").add_requirement(Perm((0,)), ((0, 0),))
    rules = list(
        strats.RowAndColumnPlacementFactory(True, False, False, False, (DIR_NORTH,))(
            tiling
        )
    )
    assert len(rules) == 1
    rule = rules[0].to_equivalence_rule()
    rule_json = original_rule_as_json(rule.original_rule)
    assert rule_json.pop("class_module") == rule.original_rule.__class__.__module__
    assert rule_json.pop("rule_class") == rule.original_rule.__class__.__name__
    assert rule_json.pop("strategy") == rule.original_rule.strategy.to_jsonable()
    children = rule_json.pop("children")
    assert len(rule_json) == 0
    assert len(children) == 2
    assert all(lambda c: isinstance(c, str) for c in children)
