from typing import Optional

from flask import Blueprint, request
from tilings.strategies import FactorFactory, RowAndColumnPlacementFactory
from tilings.tiling import Tiling
from werkzeug.exceptions import BadRequest

from ..combinatorics import rule_as_json

strategies_blueprint = Blueprint(
    "strategies_blueprint", __name__, url_prefix="/api/strategies"
)


@strategies_blueprint.route("/factor", methods=["POST"])
def factor() -> dict:
    """Apply factor strategy to given tiling."""
    data: Optional[dict] = request.get_json()
    if data is None:
        raise BadRequest()
    try:
        tiling: Tiling = Tiling.from_dict(data)
    except (TypeError, KeyError, ValueError) as exc:
        raise BadRequest() from exc
    strats = FactorFactory()(tiling)
    for strat in strats:
        rule = strat(tiling)
        return rule_as_json(rule)
    raise BadRequest()


@strategies_blueprint.route("/rowcolplace", methods=["POST"])
def row_col_placement() -> dict:
    """Apply row column placement strategy to given tiling."""
    data: Optional[dict] = request.get_json()
    if data is None:
        raise BadRequest()
    if not data or "tiling" not in data or "dir" not in data or "row" not in data:
        raise BadRequest()
    try:
        tiling: Tiling = Tiling.from_dict(data["tiling"])
        direction: int = data["dir"]
        row: bool = data["row"]
        rules = RowAndColumnPlacementFactory(row, not row, dirs=(direction,))(tiling)
    except (TypeError, KeyError, ValueError) as exc:
        raise BadRequest() from exc
    for rule in rules:
        return rule_as_json(rule)
    raise BadRequest()
