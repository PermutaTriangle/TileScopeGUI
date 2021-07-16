import { divWrap, downloadJson, uuid } from '../../src/utils/dom_utils';

test('test div wrap', () => {
  const elem = document.createElement('p');
  elem.innerHTML = 'some text';
  const div = divWrap('mydiv', elem);
  expect(div.id).toBe('mydiv');
  expect(div.firstChild.innerHTML).toBe('some text');
});

test('test uuid', () => {
  for (let i = 0; i < 100; i += 1) {
    const id = uuid();
    expect(id.length).toBe(36);
    const arr = id.split('-');
    expect(arr.length).toBe(5);
    arr.forEach((part) => {
      expect(part.match(/^[0-9a-z]+$/));
    });
  }
});

test('test download json', () => {
  global.URL.createObjectURL = jest.fn();
  global.Blob = class MockBlob {
    constructor(a, b) {
      this.jsonStr = a;
      this.settings = b;
    }
  };
  downloadJson({ a: 3 }, 'myfile');
  expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1);
  const callParam = global.URL.createObjectURL.mock.calls[0][0];
  expect(callParam.jsonStr[0]).toBe('{"a":3}');
  expect(callParam.settings.type).toBe('text/plain');
});
