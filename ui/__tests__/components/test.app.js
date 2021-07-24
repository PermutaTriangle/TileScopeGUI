import $ from 'jquery';

import MockErrorDisplay from '../../__mocks__/components/error_display';
import mockAxios from '../../__mocks__/axios';
import mockBootstrap from '../../__mocks__/bootstrap';

import { fireEvent, getByText } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';
import waitForExpect from 'wait-for-expect';

import App from '../../src/components/app';

beforeEach(() => {
  $('body').append('<div id="app"></div>');
});

afterEach(() => {
  $('#app').remove();
  expect($('body').html()).toBe('');
  MockErrorDisplay.clearAllMocks();
});

test('test construct app', () => {
  (() => new App('app'))();
  expect($('div.topnav')[0]).toBeInTheDocument();
  //expect($('div#error-msg')[0]).toBeInTheDocument();
  expect($('.basis-input').length).toBe(0);
});

test('test init app', () => {
  const app = new App('app');
  app.init();
  expect($('div.topnav')[0]).toBeInTheDocument();
  //expect($('div#error-msg')[0]).toBeInTheDocument();
  expect($('.basis-input')[0]).toBeInTheDocument();
});

describe('test initial tiling request failure', () => {
  const tester = async (err, msg) => {
    mockAxios.post.mockImplementationOnce(() => Promise.reject(err));
    const app = new App('app');
    expect(MockErrorDisplay.mConstructor).toHaveBeenCalledTimes(1);
    const constructorCall = MockErrorDisplay.mConstructor.mock.calls.pop();
    expect(constructorCall[0][0].id).toBe('app');
    app.init();
    fireEvent.keyPress($('.basis-input > input')[0], { key: 'Enter', target: { value: '123' } });
    await waitForExpect(() => {
      expect(MockErrorDisplay.mAlert).toHaveBeenCalledTimes(1);
      const alertCall = MockErrorDisplay.mAlert.mock.calls.pop();
      expect(alertCall[0]).toBe(msg);
    });
  };

  test('Not http error', async () => {
    await tester(new Error('myerr'), 'Server unavailable');
  });

  test('http error', async () => {
    const err = new Error('myerr');
    err.response = { status: 400 };
    await tester(err, 'Invalid input');
  });
});
