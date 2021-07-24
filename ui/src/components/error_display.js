import $ from 'jquery';

import Toast from './bootstrap_wrappers/toast';
import { uuid } from '../utils/dom_utils';

import './styles/error_display.scss';

/**
 * A component for error messages.
 */
class ErrorDisplay {
  // #region Static variables

  /**
   * Time until toast fades out.
   */
  static TIMEOUT = 4000;

  /**
   * Time from fade out until removal.
   */
  static REMOVE_DELAY = 500;

  /**
   * Fixed Toast argument options.
   */
  static OPTIONS = { autohide: false };

  // #endregion

  // #region Private variables

  /** @type {JQuery} */
  #parent;

  /** @type {Toast} */
  #toast;

  // #endregion

  // #region Public functions

  /**
   * Create a error message component.
   *
   * @constructor
   * @param {JQuery} parentDom
   */
  constructor(parentDom) {
    this.#parent = parentDom;
    this.#toast = new Toast(this.#parent, 'error-msg');
  }

  /**
   * Display error message.
   *
   * @param {string} msg
   * @param {boolean} [success] defaults to false
   */
  alert(msg, success = false) {
    this.#toast.flash(
      `toast-${uuid()}`,
      msg,
      ErrorDisplay.TIMEOUT,
      ErrorDisplay.REMOVE_DELAY,
      success,
      ErrorDisplay.OPTIONS,
    );
  }

  /**
   * Alert not implemented.
   */
  notImplemented() {
    this.alert('Not implemented');
  }

  /**
   * Temporary move error display under another parent.
   *
   * @param {JQuery} newParent
   */
  moveToParent(newParent) {
    this.#toastContainer().detach().appendTo(newParent);
  }

  /**
   * Restore error display to the original parent.
   */
  restoreParent() {
    this.#toastContainer().detach().appendTo(this.#parent);
  }

  // #endregion

  // #region Private functions

  /**
   * Get container selector for toast object.
   *
   * @returns {JQuery} selector
   */
  #toastContainer() {
    return $(`#${this.#toast.getId()}`);
  }

  // #endregion
}

export default ErrorDisplay;
