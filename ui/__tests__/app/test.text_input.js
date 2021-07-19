import $ from 'jquery';
import { fireEvent, getByText } from '@testing-library/dom';
import TextInput from '../../src/app/text_input';
import '@testing-library/jest-dom/extend-expect';

let msg;
let callback;
let textInput;

beforeEach(() => {
  $('body').append('<div id="parent"></div>');
  msg = jest.fn();
  callback = jest.fn();
  textInput = new TextInput($('#parent'), msg, callback);
});

test('test text input construction and deconstruction', () => {
  expect(getByText(document.body, 'Basis')).toBeInTheDocument();
  const divPar = $('.basis-input')[0];
  expect(divPar).toBeInTheDocument();
  expect(divPar.tagName).toBe('DIV');
  const input = $('.basis-input > input')[0];
  expect(input).toBeInTheDocument();
  expect(input.placeholder).toBe('Basis');
  expect(input.name).toBe('basis');
  const label = $('.basis-input > label')[0];
  expect(label).toBeInTheDocument();
  expect(label.htmlFor).toBe('basis');
  expect(label.innerHTML).toBe('Basis');

  textInput.remove();
  expect($('.basis-input').length).toBe(0);
  expect($('body').html()).toBe('<div id="parent"></div>');
});

test('test label focus', () => {
  expect(document.activeElement).not.toEqual($('.basis-input > input')[0]);
  fireEvent.click($('.basis-input > label')[0]);
  expect(document.activeElement).toEqual($('.basis-input > input')[0]);
});

describe('input success', () => {
  const successTest = (val, jsonify = false, expected = null) => {
    const value = jsonify ? JSON.stringify(val) : val;
    fireEvent.keyPress($('.basis-input > input')[0], { key: 'Enter', target: { value } });
    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(expected === null ? val : expected);
    expect(msg).toBeCalledTimes(0);
  };

  test('number', () => {
    successTest('123');
  });

  test('string', () => {
    successTest('123, 213', false, '123_213');
  });

  test('tiling object', () => {
    successTest(
      {
        class_module: 0,
        comb_class: 0,
        obstructions: 0,
        requirements: 0,
        assumptions: 0,
      },
      true,
    );
  });
});

describe('input failure', () => {
  const failureTest = (val, stringify = true) => {
    const value = stringify ? JSON.stringify(val) : val;
    fireEvent.keyPress($('.basis-input > input')[0], { key: 'Enter', target: { value } });
    expect(callback).toBeCalledTimes(0);
    expect(msg).toBeCalledTimes(1);
    expect(msg).toBeCalledWith('Invalid input');
  };

  const tilingJson = {
    class_module: 0,
    comb_class: 0,
    obstructions: 0,
    requirements: 0,
    assumptions: 0,
  };

  test('empty', () => {
    failureTest('', false);
  });

  test('boolean', () => {
    failureTest(false);
  });

  test('array', () => {
    failureTest([1, 2, 3]);
  });

  test('tiling missing class_module', () => {
    delete tilingJson.class_module;
    failureTest(tilingJson);
  });

  test('tiling missing comb_class', () => {
    delete tilingJson.comb_class;
    failureTest(tilingJson);
  });

  test('tiling missing obstructions', () => {
    delete tilingJson.obstructions;
    failureTest(tilingJson);
  });

  test('tiling missing requirements', () => {
    delete tilingJson.requirements;
    failureTest(tilingJson);
  });

  test('tiling missing assumptions', () => {
    delete tilingJson.assumptions;
    failureTest(tilingJson);
  });
});
