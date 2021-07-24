import AppState from '../../src/utils/app_state';

test('test app state', () => {
  const state = new AppState();

  state.setCellInsertPatt('123');
  state.setFusionRow(false);
  state.setReqPlacementDirection('s');
  state.setReqPlacementIdx(5);
  state.setRowColPlacementDirection('w');
  state.setRowColPlacementRow(false);

  expect(state.getCellInsertPatt()).toBe('123');
  expect(state.getFusionRow()).toBe(false);
  expect(state.getReqPlacementDirection()).toBe('s');
  expect(state.getReqPlacementIdx()).toBe(5);
  expect(state.getRowColPlacementDirection()).toBe('w');
  expect(state.getRowColPlacementRow()).toBe(false);
});
