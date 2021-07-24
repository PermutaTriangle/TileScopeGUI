import dictionary from '../../src/containers/dictionary';

test('Test dictionary with prior data', () => {
  const dict = dictionary({ 4: 3, 5: 4 });
  expect(dict.contains(4)).toBeTruthy();
  expect(dict.contains(5)).toBeTruthy();
  expect(dict.contains(2)).toBeFalsy();
  expect(dict.contains(3)).toBeFalsy();
  dict.set(3, 5);
  expect(dict.contains(3)).toBeTruthy();
  expect(dict.get(4)).toBe(3);
  expect(dict.get(5)).toBe(4);
  expect(dict.get(3)).toBe(5);
});

test('Test dictionary with no prior data', () => {
  const dict = dictionary();
  expect(dict.contains('asdf')).toBeFalsy();
  expect(dict.contains(77)).toBeFalsy();
  dict.set('mykey', 'myval');
  expect(dict.get('mykey')).toBe('myval');
  expect(dict.contains('mykey')).toBeTruthy();
});
