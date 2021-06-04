import itertools
from random import shuffle

from comb_spec_searcher.strategies.rule import Rule
from flask import Blueprint, request
from tilings.strategies import FactorFactory, RowAndColumnPlacementFactory
from tilings.tiling import Tiling
from werkzeug.exceptions import BadRequest

from ..combinatorics import tiling_to_gui_json

tiling_blueprint = Blueprint("tiling_blueprint", __name__, url_prefix="/api/tiling")


@tiling_blueprint.route("/init", methods=["POST"])
def tiling_from_basis() -> dict:
    """Get an initial tiling."""
    print(request.data)
    data = request.get_json(silent=False)
    print(type(data))
    try:
        if isinstance(data, str):
            print(data)
            tiling = Tiling.from_string(data)
        else:
            tiling = Tiling.from_dict(data)
    except (TypeError, KeyError, ValueError) as exc:
        raise BadRequest() from exc
    return tiling_to_gui_json(tiling)


@tiling_blueprint.route("/randomrule", methods=["POST"])
def randomrule() -> dict:
    """Temp for testing..."""
    try:
        tiling = Tiling.from_dict(request.get_json())
    except (TypeError, KeyError, ValueError) as exc:
        raise BadRequest() from exc
    lis = list(
        itertools.chain(FactorFactory()(tiling), RowAndColumnPlacementFactory()(tiling))
    )
    shuffle(lis)
    rule = lis[0]
    assert isinstance(rule, Rule)
    return {
        "class_module": rule.__class__.__module__,
        "rule_class": rule.__class__.__name__,
        "strategy": rule.strategy.to_jsonable(),
        "children": [tiling_to_gui_json(child) for child in rule.children],
        "formal_step": rule.formal_step,
        "op": rule.get_op_symbol(),
    }
