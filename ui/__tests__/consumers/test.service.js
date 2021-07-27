import mockAxios from '../../__mocks__/axios';

import AppState from '../../src/utils/app_state';
import {
  getTiling,
  decodeTilings,
  rowColPlacement,
  factor,
  cellInsertion,
  rowColSeparation,
  obstructionTransivity,
  reqPlacement,
  addAssumption,
  fusion,
  sliding,
  symmetries,
  rearrangeAssumption,
} from '../../src/consumers/service';

const tester = async (apiCall, callArgs, expectedPath, expectedJson) => {
  mockAxios.post.mockImplementationOnce(() => Promise.resolve({ data: 'mydata', status: 200 }));
  const res = await apiCall(...callArgs);
  const args = mockAxios.post.mock.calls.pop();
  expect(args[0]).toBe(expectedPath);
  expect(args[1]).toBe(expectedJson);
  expect(res.data).toBe('mydata');
  expect(res.status).toBe(200);
};

const state = new AppState();
const verify = { basis: [], strats: [0, 1] };

test('test getTiling service', async () => {
  await tester(
    getTiling,
    ['123', state],
    '/tiling/init',
    JSON.stringify({ tiling: '123', verify }),
  );
});

test('test decodeTilings service', async () => {
  await tester(decodeTilings, [['a', 'b']], '/tiling/decode', JSON.stringify(['a', 'b']));
});

test('test rowColPlacement service', async () => {
  await tester(
    rowColPlacement,
    ['tilingJson', state, 0, true, 0],
    '/strategies/rowcolplace',
    JSON.stringify({ tiling: 'tilingJson', verify, dir: 0, row: true, idx: 0 }),
  );
});

test('test factor service', async () => {
  await tester(
    factor,
    ['tilingJson', state],
    '/strategies/factor',
    JSON.stringify({ tiling: 'tilingJson', verify }),
  );
  await tester(
    factor,
    ['tilingJson', state, true],
    '/strategies/factor?interleaving=all',
    JSON.stringify({ tiling: 'tilingJson', verify }),
  );
});

test('test cellInsertion service', async () => {
  await tester(
    cellInsertion,
    ['tilingJson', state, 3, 2, '123'],
    '/strategies/cellinsertion',
    JSON.stringify({ tiling: 'tilingJson', verify, x: 3, y: 2, patt: '123' }),
  );
});

test('test rowcolsep service', async () => {
  await tester(
    rowColSeparation,
    ['tilingJson', state],
    '/strategies/rowcolsep',
    JSON.stringify({ tiling: 'tilingJson', verify }),
  );
});

test('test obstrans service', async () => {
  await tester(
    obstructionTransivity,
    ['tilingJson', state],
    '/strategies/obstrans',
    JSON.stringify({ tiling: 'tilingJson', verify }),
  );
});

test('test reqplace service', async () => {
  await tester(
    reqPlacement,
    ['tilingJson', state, 1, 2, 3, 2],
    '/strategies/reqplace',
    JSON.stringify({ tiling: 'tilingJson', verify, x: 1, y: 2, idx: 3, dir: 2 }),
  );
});

test('test addassumption service', async () => {
  await tester(
    addAssumption,
    [
      'tilingJson',
      state,
      [
        [1, 2],
        [0, 3],
        [5, 8],
      ],
    ],
    '/strategies/addassumption',
    JSON.stringify({
      tiling: 'tilingJson',
      verify,
      pos: [
        [1, 2],
        [0, 3],
        [5, 8],
      ],
    }),
  );
});

test('test fusion service', async () => {
  await tester(
    fusion,
    ['tilingJson', state, 2, true],
    '/strategies/fusion',
    JSON.stringify({ tiling: 'tilingJson', verify, idx: 2, row: true }),
  );
});

test('test sliding service', async () => {
  await tester(
    sliding,
    ['tilingJson', state, 1, 3],
    '/strategies/sliding',
    JSON.stringify({ tiling: 'tilingJson', verify, idx1: 1, idx2: 3 }),
  );
});

test('test symmetry service', async () => {
  await tester(
    symmetries,
    ['tilingJson', state, 6],
    '/strategies/symmetry',
    JSON.stringify({ tiling: 'tilingJson', verify, symmetry: 6 }),
  );
});

test('test rearrangeassumption service', async () => {
  await tester(
    rearrangeAssumption,
    ['tilingJson', state],
    '/strategies/rearrangeassumption',
    JSON.stringify({ tiling: 'tilingJson', verify }),
  );
});
