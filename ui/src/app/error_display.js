import { Toast } from 'bootstrap';
import $ from 'jquery';

import { uuid } from '../utils/utils';

import './styles/error_display.scss';

/**
 * A component for error messages.
 */
class ErrorDisplay {
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

  /**
   * Generate html for a single error message.
   */
  static single(id, msg) {
    return `<div id="${id}" class="toast align-items-center" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="d-flex">
      <div class="toast-body">
      ${msg}
     </div>
      <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  </div>`;
  }

  /**
   * Get html for the error container.
   */
  static getHTML() {
    return `<div id="error-msg" class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
      <div class="toast-container">
      </div>
      </div>`;
  }

  /**
   * Create a error message component.
   */
  constructor(parentDom) {
    this.parent = parentDom;
    parentDom.append(ErrorDisplay.getHTML());
    this.container = $('.toast-container');
  }

  /**
   * Display error message.
   */
  alert(msg) {
    const id = `toast-${uuid()}`;
    this.container.append(ErrorDisplay.single(id, msg));
    const selector = $(`#${id}`);
    const toast = new Toast(selector, ErrorDisplay.OPTIONS);
    toast.show();
    setTimeout(() => {
      toast.dispose();
      setTimeout(() => {
        selector.remove();
      }, ErrorDisplay.REMOVE_DELAY);
    }, ErrorDisplay.TIMEOUT);
  }

  notImplemented() {
    this.alert('Not implemented');
  }

  moveToParent(newParent) {
    this.container.parent().detach().appendTo(newParent);
  }

  restoreParent() {
    this.container.parent().detach().appendTo(this.parent);
  }
}

export default ErrorDisplay;
