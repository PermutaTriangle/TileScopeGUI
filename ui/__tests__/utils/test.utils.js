import { isObj, isProduction, isStr } from '../../src/utils/utils';

test('test isStr', () => {
  expect(isStr('')).toBe(true);
  expect(isStr('abc')).toBe(true);

  expect(isStr(undefined)).toBe(false);
  expect(isStr(null)).toBe(false);
  expect(isStr(0)).toBe(false);
  expect(isStr(1)).toBe(false);
  expect(isStr(-3.2)).toBe(false);
  expect(isStr(false)).toBe(false);
  expect(isStr([])).toBe(false);
  expect(isStr({})).toBe(false);
  expect(isStr([1, 2, 3])).toBe(false);
  expect(isStr({ 1: 2, 3: 4 })).toBe(false);
});

test('test isProduction', () => {
  expect(isProduction()).toBe(false);
  expect(process.env.NODE_ENV).toBe('test');
  process.env.NODE_ENV = 'production';
  expect(isProduction()).toBe(true);
  process.env.NODE_ENV = 'test';
});

test('test uuid', () => {
  expect(isObj({})).toBe(true);
  expect(isObj({ 1: { a: 2 } })).toBe(true);
  expect(isObj([])).toBe(true);
  expect(isObj([1, 2, 3])).toBe(true);

  expect(isObj(() => 1)).toBe(false);
  expect(isObj(1)).toBe(false);
  expect(isObj(false)).toBe(false);
  expect(isObj('asdf')).toBe(false);
});
