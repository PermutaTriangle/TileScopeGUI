/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */

class MockModal {
  static modalConstructor = jest.fn();

  static modalShow = jest.fn();

  static modalHide = jest.fn();

  constructor(...args) {
    MockModal.modalConstructor(args);
  }

  show() {
    MockModal.modalShow();
  }

  hide() {
    MockModal.modalHide();
  }
}

class MockToast {
  static toastConstructor = jest.fn();

  static toastShow = jest.fn();

  static toastDispose = jest.fn();

  constructor(...args) {
    MockToast.toastConstructor(args);
  }

  show() {
    MockToast.toastShow();
  }

  dispose() {
    MockToast.toastDispose();
  }
}

const mockBootstrap = {
  Modal: MockModal,
  Toast: MockToast,
  clear: () => {
    MockModal.modalShow.mockClear();
    MockModal.modalHide.mockClear();
    MockModal.modalConstructor.mockClear();
    MockToast.toastShow.mockClear();
    MockToast.toastDispose.mockClear();
    MockToast.toastConstructor.mockClear();
  },

  mockFuncs: () => ({
    modalShow: MockModal.modalShow,
    modalHide: MockModal.modalHide,
    modalConstructor: MockModal.modalConstructor,
    toastShow: MockToast.toastShow,
    toastDispose: MockToast.toastDispose,
    toastConstructor: MockToast.toastConstructor,
  }),
};

jest.mock('bootstrap', () => mockBootstrap);

export default mockBootstrap;
