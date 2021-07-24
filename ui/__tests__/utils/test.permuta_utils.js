import {
  directionNumberToString,
  directionStringToNumber,
  allSymmetries,
  isEquivOp,
} from '../../src/utils/permuta_utils';

test('test is equiv op', () => {
  expect(isEquivOp('≅')).toBe(true);
  expect(isEquivOp('')).toBe(false);
  expect(isEquivOp('+')).toBe(false);
  expect(isEquivOp('x')).toBe(false);
  expect(isEquivOp('?')).toBe(false);
});

test('test all syms', () => {
  expect(allSymmetries().length).toBe(7);
});

test('test direction number to string', () => {
  expect(directionNumberToString(0)).toBe('e');
  expect(directionNumberToString(1)).toBe('n');
  expect(directionNumberToString(2)).toBe('w');
  expect(directionNumberToString(3)).toBe('s');
});

test('test direction string to nubmer', () => {
  expect(directionStringToNumber('e')).toBe(0);
  expect(directionStringToNumber('n')).toBe(1);
  expect(directionStringToNumber('w')).toBe(2);
  expect(directionStringToNumber('s')).toBe(3);
});
