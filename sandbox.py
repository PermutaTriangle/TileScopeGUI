# TODO:
# 1.
# 2. import/export sessions
# 3. Improve UI for add req and place req (different perm, choose points, etc)
# 4. Some early non-server failures for strats when applies (e.g. sliding if not 1xN)
# 5.
# 6. Refactor
# 7. Testing
# 8. Styling not as horrible
# 9.
# 10:
# 11.


from tilings import GriddedPerm, Tiling

Tiling(
    obstructions=(
        GriddedPerm((0, 1), ((2, 0), (2, 0))),
        GriddedPerm((0, 1, 2), ((0, 0), (0, 0), (0, 0))),
        GriddedPerm((0, 1, 2), ((0, 0), (0, 0), (1, 0))),
        GriddedPerm((0, 1, 2), ((0, 0), (0, 0), (2, 0))),
        GriddedPerm((0, 1, 2), ((0, 0), (1, 0), (1, 0))),
        GriddedPerm((0, 1, 2), ((0, 0), (1, 0), (2, 0))),
        GriddedPerm((0, 1, 2), ((1, 0), (1, 0), (1, 0))),
        GriddedPerm((0, 1, 2), ((1, 0), (1, 0), (2, 0))),
    ),
    requirements=(),
    assumptions=(),
).to_gui()
