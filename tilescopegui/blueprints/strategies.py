from typing import TYPE_CHECKING, Iterable, Tuple, TypeVar

from comb_spec_searcher.exception import StrategyDoesNotApply
from flask import Blueprint, request
from permuta.patterns.perm import Perm
from tilings.griddedperm import GriddedPerm
from tilings.strategies import FactorFactory, RowAndColumnPlacementFactory
from tilings.strategies.requirement_insertion import RequirementInsertionStrategy
from tilings.tiling import Tiling
from werkzeug.exceptions import BadRequest

from ..combinatorics import rule_as_json

if TYPE_CHECKING:
    ItType = TypeVar("ItType")

strategies_blueprint = Blueprint(
    "strategies_blueprint", __name__, url_prefix="/api/strategies"
)


def _get_request_json() -> dict:
    data = request.get_json()
    if data is None or not isinstance(data, dict):
        raise BadRequest()
    return data


def _first_or_bad(iterable: Iterable["ItType"]) -> "ItType":
    for element in iterable:
        return element
    raise BadRequest()


def _get_factor_input() -> Tiling:
    data = _get_request_json()
    try:
        tiling: Tiling = Tiling.from_dict(data)
    except (TypeError, KeyError, ValueError) as exc:
        raise BadRequest() from exc
    return tiling


@strategies_blueprint.route("/factor", methods=["POST"])
def factor() -> dict:
    """Apply factor strategy to given tiling."""
    tiling = _get_factor_input()
    strats = FactorFactory()(tiling)
    strat = _first_or_bad(strats)
    rule = strat(tiling)
    return rule_as_json(rule)


def _get_row_col_placement_input() -> Tuple[Tiling, int, bool]:
    data = _get_request_json()
    try:
        tiling: Tiling = Tiling.from_dict(data["tiling"])
        direction: int = data["dir"]
        row: bool = data["row"]
    except (TypeError, KeyError, ValueError) as exc:
        raise BadRequest() from exc
    if not isinstance(direction, int) or not isinstance(row, bool):
        raise BadRequest()
    if direction < 0 or direction > 3:
        raise BadRequest()
    return tiling, direction, row


@strategies_blueprint.route("/rowcolplace", methods=["POST"])
def row_col_placement() -> dict:
    """Apply row column placement strategy to given tiling."""
    tiling, direction, row = _get_row_col_placement_input()
    rules = RowAndColumnPlacementFactory(row, not row, dirs=(direction,))(tiling)
    rule = _first_or_bad(rules)
    return rule_as_json(rule)


def _get_cell_insertion_input() -> Tuple[Tiling, GriddedPerm]:
    data = _get_request_json()
    try:
        tiling: Tiling = Tiling.from_dict(data["tiling"])
        x: int = data["x"]
        y: int = data["y"]
        patt: str = data["patt"]
    except (TypeError, KeyError, ValueError) as exc:
        raise BadRequest() from exc
    if not (isinstance(x, int) and isinstance(y, int) and isinstance(patt, str)):
        raise BadRequest()
    if not patt.isdecimal():
        raise BadRequest()
    _x, _y = tiling.dimensions
    if x < 0 or x >= _x or y < 0 or y >= _y:
        raise BadRequest()
    n, value_set = len(patt), set(map(int, patt))
    if len(value_set) != n or not all(
        i in value_set for i in (range(n) if 0 in value_set else range(1, n + 1))
    ):
        raise BadRequest()
    return tiling, GriddedPerm.single_cell(Perm.to_standard(patt), (x, y))


@strategies_blueprint.route("/cellinsertion", methods=["POST"])
def cell_insertion() -> dict:
    """Apply cell insertion strategy to given tiling."""
    tiling, gp = _get_cell_insertion_input()
    try:
        rule = RequirementInsertionStrategy((gp,))(tiling)
    except StrategyDoesNotApply as exc:
        raise BadRequest() from exc
    return rule_as_json(rule)
