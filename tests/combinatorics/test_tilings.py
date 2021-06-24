from typing import List

from tilings import GriddedPerm, Tiling

from tilescopegui.combinatorics.tilings import Labeller


def test_labeller():
    def str2mat(tiling: Tiling) -> List[List[str]]:
        lines = str(tiling).splitlines()
        last = next((i - 2 for i in range(0, len(lines), 2) if lines[i] != lines[0]))
        return [line[1:-1].split("|") for line in lines[1:last:2]]

    tilings = [
        Tiling(
            obstructions=(
                GriddedPerm((0,), ((1, 0),)),
                GriddedPerm((0,), ((2, 1),)),
                GriddedPerm((0, 1), ((1, 1), (1, 1))),
                GriddedPerm((0, 1), ((2, 0), (2, 0))),
                GriddedPerm((1, 0), ((1, 1), (1, 1))),
                GriddedPerm((1, 0), ((1, 1), (2, 0))),
                GriddedPerm((1, 0), ((2, 0), (2, 0))),
                GriddedPerm((0, 1, 2), ((0, 0), (0, 0), (0, 1))),
                GriddedPerm((0, 1, 2), ((0, 0), (0, 0), (2, 0))),
                GriddedPerm((0, 1, 2), ((0, 0), (0, 1), (0, 1))),
                GriddedPerm((0, 1, 2), ((0, 0), (0, 1), (1, 1))),
                GriddedPerm((0, 2, 1), ((0, 0), (0, 0), (0, 0))),
                GriddedPerm((0, 2, 1), ((0, 0), (0, 0), (2, 0))),
                GriddedPerm((1, 0, 2), ((0, 1), (0, 0), (1, 1))),
                GriddedPerm((2, 0, 1), ((0, 0), (0, 0), (0, 0))),
                GriddedPerm((0, 1, 3, 2), ((0, 1), (0, 1), (0, 1), (0, 1))),
                GriddedPerm((0, 1, 3, 2), ((0, 1), (0, 1), (0, 1), (1, 1))),
                GriddedPerm((0, 2, 1, 3), ((0, 1), (0, 1), (0, 1), (0, 1))),
                GriddedPerm((0, 2, 1, 3), ((0, 1), (0, 1), (0, 1), (1, 1))),
                GriddedPerm((0, 2, 3, 1), ((0, 1), (0, 1), (0, 1), (0, 1))),
                GriddedPerm((0, 2, 3, 1), ((0, 1), (0, 1), (0, 1), (1, 1))),
                GriddedPerm((2, 0, 1, 3), ((0, 1), (0, 1), (0, 1), (0, 1))),
                GriddedPerm((2, 0, 1, 3), ((0, 1), (0, 1), (0, 1), (1, 1))),
            ),
            requirements=(
                (GriddedPerm((0,), ((1, 1),)), GriddedPerm((0,), ((2, 0),))),
                (GriddedPerm((1, 0, 2), ((0, 0), (0, 0), (0, 0))),),
            ),
        ),
        Tiling(
            obstructions=(
                GriddedPerm((0, 1), ((0, 0), (0, 1))),
                GriddedPerm((1, 0), ((0, 1), (0, 0))),
            ),
            requirements=(
                (GriddedPerm((0,), ((0, 0),)),),
                (GriddedPerm((0,), ((0, 1),)),),
            ),
        ),
        Tiling(
            obstructions=[
                GriddedPerm((0, 1, 2), ((0, 0), (0, 0), (0, 0))),
                GriddedPerm((0, 2, 1), ((1, 0), (1, 0), (1, 0))),
                GriddedPerm((2, 1, 0), ((2, 2), (2, 2), (2, 2))),
                GriddedPerm((2, 0, 1), ((2, 3), (2, 3), (2, 3))),
                GriddedPerm((1, 0, 2), ((5, 4), (5, 4), (5, 4))),
                GriddedPerm((2, 0, 1), ((5, 4), (5, 4), (5, 4))),
                GriddedPerm((1, 2, 0), ((4, 6), (4, 6), (4, 6))),
                GriddedPerm((0, 1, 2), ((0, 0), (0, 0), (2, 2))),
                GriddedPerm((0, 1, 2, 3), ((2, 2), (2, 2), (2, 3), (2, 3))),
                GriddedPerm((0, 1), ((6, 4), (6, 4))),
                GriddedPerm((1, 0), ((6, 4), (6, 4))),
                GriddedPerm((0, 1), ((7, 7), (7, 7))),
            ],
            requirements=[
                [
                    GriddedPerm((0, 1), ((0, 0), (0, 0))),
                    GriddedPerm((1, 0), ((4, 6), (4, 6))),
                ],
                [GriddedPerm((0,), ((6, 4),))],
            ],
        ),
        Tiling(
            obstructions=[
                GriddedPerm((0, 1), ((0, 1), (0, 1))),
                GriddedPerm((1, 0), ((0, 0), (0, 0))),
                GriddedPerm((1, 0), ((0, 1), (0, 1))),
                GriddedPerm((0, 3, 2, 1), ((0, 0), (0, 2), (0, 1), (0, 0))),
                GriddedPerm((0, 3, 2, 1), ((0, 0), (0, 2), (0, 2), (0, 0))),
                GriddedPerm((0, 3, 2, 1), ((0, 0), (0, 2), (0, 2), (0, 1))),
                GriddedPerm((0, 3, 2, 1), ((0, 0), (0, 2), (0, 2), (0, 2))),
                GriddedPerm((0, 3, 2, 1), ((0, 1), (0, 2), (0, 2), (0, 2))),
                GriddedPerm((0, 3, 2, 1), ((0, 2), (0, 2), (0, 2), (0, 2))),
                GriddedPerm((1, 0, 3, 2), ((0, 1), (0, 0), (0, 2), (0, 2))),
                GriddedPerm((1, 0, 3, 2), ((0, 2), (0, 0), (0, 2), (0, 2))),
                GriddedPerm((1, 0, 3, 2), ((0, 2), (0, 1), (0, 2), (0, 2))),
                GriddedPerm((1, 0, 3, 2), ((0, 2), (0, 2), (0, 2), (0, 2))),
            ],
            requirements=[[GriddedPerm((1, 0), ((0, 1), (0, 0)))]],
        ),
    ]

    for t in tilings:
        assert str2mat(t) == Labeller.get_gui_format(t)["matrix"]
