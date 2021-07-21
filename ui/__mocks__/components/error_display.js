/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */

class MockErrorDisplay {
  static mConstructor = jest.fn();

  static mAlert = jest.fn();

  static mNotImplemented = jest.fn();

  static mMoveToParent = jest.fn();

  static mRestoreParent = jest.fn();

  constructor(parentDom) {
    MockErrorDisplay.mConstructor(parentDom);
  }

  alert(msg, success = false) {
    MockErrorDisplay.mAlert(msg, success);
  }

  notImplemented() {
    MockErrorDisplay.mNotImplemented();
  }

  moveToParent(newParent) {
    MockErrorDisplay.mMoveToParent();
  }

  restoreParent() {
    MockErrorDisplay.mRestoreParent();
  }

  static clearAllMocks() {
    MockErrorDisplay.mConstructor.mockClear();
    MockErrorDisplay.mAlert.mockClear();
    MockErrorDisplay.mNotImplemented.mockClear();
    MockErrorDisplay.mMoveToParent.mockClear();
    MockErrorDisplay.mRestoreParent.mockClear();
  }
}

jest.mock('../../src/app/error_display', () => MockErrorDisplay);

export default MockErrorDisplay;
