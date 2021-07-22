import $ from 'jquery';

import { Toast as BSToast } from 'bootstrap';

/**
 * A wrapper class for bs Toast.
 */
class Toast {
  // #region Static functions

  /**
   * Get html for the error container.
   *
   * @param {string} id
   * @returns {string} raw HTML string
   */
  static getContainerHTML(id) {
    return `<div id="${id}" class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
  <div class="toast-container">
  </div>
</div>`;
  }

  /**
   * Get html for a single toast item.
   *
   * @param {string} id
   * @param {string} body
   * @param {boolean} success
   * @returns {string} raw HTML string
   */
  static singleToastItem(id, body, success = false) {
    return `<div id="${id}" class="toast${
      success ? ' toast-success' : ''
    } align-items-center" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="d-flex">
    <div class="toast-body">
      ${body}
    </div>
    <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
  </div>
</div>`;
  }

  // #endregion

  // #region Private instance variables

  /** @type {JQuery} */
  #container;

  // #endregion

  // #region Public functions

  /**
   * Create a toast object.
   *
   * @constructor
   * @param {JQuery} parentContainer
   * @param {string} containerId
   */
  constructor(parentContainer, containerId) {
    parentContainer.append(Toast.getContainerHTML(containerId));
    this.#container = $(`#${containerId}`);
  }

  /**
   * Get id of containing dom element.
   *
   * @returns {string} id
   */
  getId() {
    return this.#container[0].id;
  }

  /**
   * Show toast message for a limited time.
   *
   * @param {string} id
   * @param {string} body
   * @param {number} fadeTime
   * @param {number} removeTime
   * @param {boolean} success
   * @param {{animation: boolean|undefined, autohide: boolean|undefined, delay: number|undefined}} options
   */
  flash(id, body, fadeTime, removeTime, success, options) {
    this.#container.append(Toast.singleToastItem(id, body, success));
    const selector = $(`#${id}`);
    const toast = new BSToast(selector, options);
    toast.show();
    setTimeout(() => {
      toast.dispose();
      setTimeout(() => {
        selector.remove();
      }, removeTime);
    }, fadeTime);
  }

  /**
   * Remove dom element for this toast.
   */
  remove() {
    this.#container.remove();
  }

  // #endregion
}

export default Toast;
