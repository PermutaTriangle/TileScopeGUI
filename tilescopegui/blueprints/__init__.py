from typing import List

from flask.blueprints import Blueprint

from .home import home_blueprint


def all_blueprints() -> List[Blueprint]:
    """Returns all blueprints."""
    return [home_blueprint]


__all__ = ["all_blueprints"]
