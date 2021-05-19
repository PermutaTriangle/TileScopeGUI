from typing import Dict, List, Tuple

from permuta.patterns.perm import Perm
from tilings.tiling import Tiling

LabelCache = Dict[Tuple[Tuple[Perm, ...], bool], str]


class Labeller:
    """Symbols for cells to plot tiling."""

    _EMPTY_STR = " "
    _POS_POINT_STR = "\u25cf"
    _NPOS_POINT_STR = "\u25cb"
    _DECREASING_STR = "\\"
    _INCREASING_STR = "/"

    _EMPTY = (Perm((0,)),)
    _POINT = (Perm((0, 1)), Perm((1, 0)))
    _DECREASING = (Perm((0, 1)),)
    _INCREASING = (Perm((1, 0)),)

    _INIT_CACHE: LabelCache = {
        (_EMPTY, False): _EMPTY_STR,
        (_EMPTY, True): _EMPTY_STR,
        (_POINT, True): _POS_POINT_STR,
        (_POINT, False): _NPOS_POINT_STR,
        (_DECREASING, True): _DECREASING_STR,
        (_DECREASING, False): _DECREASING_STR,
        (_INCREASING, True): _INCREASING_STR,
        (_INCREASING, False): _INCREASING_STR,
    }

    @classmethod
    def get_label_matrix(cls, tiling: Tiling) -> List[List[str]]:
        """Return a matrix corresponding to the tiling of symbols that should be
        drawn in each cell."""
        labeller = cls(tiling)
        labeller.find_symbols()
        return labeller.img

    def __init__(self, tiling: Tiling) -> None:
        self.tiling = tiling
        self.curr_label = 1
        self.cache: LabelCache = dict(Labeller._INIT_CACHE.items())
        cols, self.rows = self.tiling.dimensions
        self.img: List[List[str]] = [
            [Labeller._EMPTY_STR for _ in range(cols)] for _ in range(self.rows)
        ]

    def _get_label(self, basis: List[Perm], positive: bool) -> str:
        key = (tuple(basis), positive)
        label = self.cache.get(key, None)
        if label is None:
            label = str(self.curr_label)
            self.cache[key] = label
            self.curr_label += 1
        return label

    def find_symbols(self) -> None:
        """Find symbols for a tiling."""
        for cell, (obstructions, _) in sorted(self.tiling.cell_basis().items()):
            self.img[self.rows - cell[1] - 1][cell[0]] = self._get_label(
                sorted(obstructions), cell in self.tiling.positive_cells
            )
