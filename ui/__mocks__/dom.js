import { JSDOM } from 'jsdom';
import nodeCrypto from 'crypto';

const dom = new JSDOM('<!DOCTYPE HTML><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;
global.crypto = {
  getRandomValues: (buffer) => nodeCrypto.randomFillSync(buffer),
};
