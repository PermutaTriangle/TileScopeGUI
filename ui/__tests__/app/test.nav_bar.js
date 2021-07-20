import $ from 'jquery';
import { fireEvent, getByText } from '@testing-library/dom';
import createNavBar from '../../src/app/nav_bar';
import '@testing-library/jest-dom/extend-expect';

let homeCallback;
let resetCallback;
let exportCallback;
let importCallback;

const callChecks = (calls) => {
  expect(homeCallback).toBeCalledTimes(calls[0]);
  expect(resetCallback).toBeCalledTimes(calls[1]);
  expect(exportCallback).toBeCalledTimes(calls[2]);
  expect(importCallback).toBeCalledTimes(calls[3]);
};

beforeEach(() => {
  $('body').append('<div id="parent"></div>');
  homeCallback = jest.fn();
  resetCallback = jest.fn();
  exportCallback = jest.fn();
  importCallback = jest.fn();
  createNavBar($('#parent'), homeCallback, resetCallback, exportCallback, importCallback);
});

afterEach(() => {
  $('#parent').remove();
  expect($('body').html()).toBe('');
});

test('test nav bar setup', () => {
  expect(getByText(document.body, 'Home')).toBeInTheDocument();
  expect(getByText(document.body, 'Reset')).toBeInTheDocument();
  expect(getByText(document.body, 'Export')).toBeInTheDocument();
  expect(getByText(document.body, 'Import')).toBeInTheDocument();
  expect($('.topnav')[0]).toBeInTheDocument();
  expect($('.topnav > a').length).toBe(4);
});

test('test nav bar callbacks', () => {
  fireEvent.click(getByText(document.body, 'Home'));
  callChecks([1, 0, 0, 0]);
  fireEvent.click(getByText(document.body, 'Reset'));
  callChecks([1, 1, 0, 0]);
  fireEvent.click(getByText(document.body, 'Export'));
  callChecks([1, 1, 1, 0]);
  fireEvent.click(getByText(document.body, 'Import'));
  callChecks([1, 1, 1, 1]);
});
