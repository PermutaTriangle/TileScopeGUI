import itertools
from random import shuffle

from comb_spec_searcher.strategies.rule import AbstractRule, Rule
from flask import Blueprint, request
from tilings.strategies import FactorFactory, RowAndColumnPlacementFactory
from tilings.tiling import Tiling
from werkzeug.exceptions import BadRequest

from ..combinatorics import tiling_to_gui_json

strategies_blueprint = Blueprint(
    "strategies_blueprint", __name__, url_prefix="/api/strategies"
)


def rule_as_json(rule: AbstractRule) -> dict:
    """Convert rule to json."""  # TODO: move elsewhere
    return {
        "class_module": rule.__class__.__module__,
        "rule_class": rule.__class__.__name__,
        "strategy": rule.strategy.to_jsonable(),
        "children": [tiling_to_gui_json(child) for child in rule.children],
        "formal_step": rule.formal_step,
        "op": rule.get_op_symbol(),
    }


@strategies_blueprint.route("/factor", methods=["POST"])
def factor() -> dict:
    data = request.get_json()
    try:
        tiling = Tiling.from_dict(data)
    except (TypeError, KeyError, ValueError) as exc:
        raise BadRequest() from exc
    strats = FactorFactory()(tiling)
    for strat in strats:
        rule = strat(tiling)
        return rule_as_json(rule)
    raise BadRequest()


@strategies_blueprint.route("/rowcol", methods=["POST"])
def row_col() -> dict:
    data = request.get_json()
    if not data or "tiling" not in data or "dir" not in data:
        raise BadRequest()
    try:
        tiling = Tiling.from_dict(data["tiling"])
        direction = data["dir"]
        # DIR_EAST = 0
        # DIR_NORTH = 1
        # DIR_WEST = 2
        # DIR_SOUTH = 3
        row = bool(direction & 1)
        rules = RowAndColumnPlacementFactory(row, not row, dirs=(direction,))(tiling)
    except (TypeError, KeyError, ValueError) as exc:
        raise BadRequest() from exc
    for rule in rules:
        return rule_as_json(rule)
    raise BadRequest()
