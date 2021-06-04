from typing import List

from flask.blueprints import Blueprint

from .home import home_blueprint
from .tiling import tiling_blueprint


def all_blueprints() -> List[Blueprint]:
    """Returns all blueprints."""
    return [home_blueprint, tiling_blueprint]


__all__ = ["all_blueprints"]
