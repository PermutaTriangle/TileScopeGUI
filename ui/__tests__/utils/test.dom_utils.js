import $ from 'jquery';

import '@testing-library/jest-dom/extend-expect';

import {
  divWrap,
  downloadJson,
  uuid,
  bsLI,
  bsULFlush,
  accordionItem,
} from '../../src/utils/dom_utils';

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

describe('test bs list gens', () => {
  test('bs list item', () => {
    expect(bsLI('mycontent')).toBe('<li class="list-group-item">mycontent</li>');
  });
  test('bs ul', () => {
    expect(bsULFlush('mycontent')).toBe('<ul class="list-group list-group-flush">mycontent</ul>');
  });
});

test('test accordionItem gen', () => {
  $('body').append(accordionItem(6, 'mytitle', 'mybody'));
  expect($('div.accordion-item')[0]).toBeInTheDocument();
  expect($('h2#panelsStayOpen-heading6')[0]).toBeInTheDocument();
  expect($('h2#panelsStayOpen-heading6')[0]).toBeInTheDocument();
  expect($('h2#panelsStayOpen-heading6')[0].className).toBe('accordion-header');
  expect($('h2#panelsStayOpen-heading6 > button')[0]).toBeInTheDocument();
  expect($('h2#panelsStayOpen-heading6 > button')[0].className).toBe('accordion-button collapsed');
  expect($('h2#panelsStayOpen-heading6 > button')[0].getAttribute('type')).toBe('button');
  expect($('h2#panelsStayOpen-heading6 > button')[0].getAttribute('data-bs-target')).toBe(
    '#panelsStayOpen-collapse6',
  );
  expect($('h2#panelsStayOpen-heading6 > button')[0].getAttribute('aria-expanded')).toBe('false');
  expect($('h2#panelsStayOpen-heading6 > button')[0].getAttribute('aria-controls')).toBe(
    'panelsStayOpen-collapse6',
  );
  expect($('h2#panelsStayOpen-heading6 > button')[0].innerHTML.trim()).toBe('mytitle');
  expect($('#panelsStayOpen-collapse6')[0]).toBeInTheDocument();
  expect($('#panelsStayOpen-collapse6')[0].className).toBe('accordion-collapse collapse');
  expect($('#panelsStayOpen-collapse6')[0].getAttribute('aria-labelledby')).toBe(
    'panelsStayOpen-heading6',
  );
  expect($('#panelsStayOpen-collapse6 > div')[0]).toBeInTheDocument();
  expect($('#panelsStayOpen-collapse6 > div')[0].innerHTML.trim()).toBe('mybody');
});
