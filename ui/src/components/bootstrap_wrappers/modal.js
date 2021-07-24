import { Modal as BSModal } from 'bootstrap';
import $ from 'jquery';

class Modal {
  // #region Static variables

  /** Type for fullscreen modal */
  static FULLSCREEN = 0;

  /** Type for modal in center */
  static CENTRAL = 1;

  // #endregion

  // #region Static functions

  /**
   * Close button for header.
   *
   * @returns {string} raw HTML string
   */
  static closeHeaderButton() {
    return '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>';
  }

  /**
   * Close button for footer.
   *
   * @returns {string} raw HTML string
   */
  static closeFooterButton() {
    return '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>';
  }

  /**
   * Danger button for footer
   *
   * @param {string} id
   * @param {string} text
   * @returns {string} raw HTML string
   */
  static dangerFooterButton(id, text) {
    return `<button id="${id}" type="button" class="btn btn-danger">${text}</button>`;
  }

  /**
   * Join the three parts into a single string.
   *
   * @param {string} header
   * @param {string} body
   * @param {string} footer
   * @returns {string} content components joined in string
   */
  static #contentJoin(header, body, footer) {
    const content = [];
    if (header) content.push(`<div class="modal-header">${header}</div>`);
    if (body) content.push(`<div class="modal-body">${body}</div>`);
    if (footer) content.push(`<div class="modal-footer">${footer}</div>`);
    return content.join('\n');
  }

  /**
   * Create a modal content div.
   *
   * @param {string} header
   * @param {string} body
   * @param {string} footer
   * @returns {string} content string
   */
  static #getContent(header, body, footer) {
    return `<div class="modal-content">${Modal.#contentJoin(header, body, footer)}</div>`;
  }

  /**
   * Create a full screen modal for dom.
   *
   * @param {string} id
   * @param {string} header
   * @param {string} body
   * @param {string} footer
   * @returns {string} raw HTML string
   */
  static #fullScreenModal(id, header, body, footer) {
    return `<div class="modal" id="${id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-fullscreen">
    ${Modal.#getContent(header, body, footer)}
  </div>
</div>;`;
  }

  /**
   * Create a central modal for dom.
   *
   * @param {string} id
   * @param {string} header
   * @param {string} body
   * @param {string} footer
   * @returns {string} raw HTML string
   */
  static #centralModal(id, header, body, footer) {
    return `<div id="${id}" class="modal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    ${Modal.#getContent(header, body, footer)}
  </div>
</div>`;
  }

  /**
   * Generate HTML for modal type and content.
   *
   * @param {number} modalType
   * @param {string} id
   * @param {string} header
   * @param {string} body
   * @param {string} footer
   * @returns {string} raw HTML string
   */
  static #getHTML(modalType, id, header, body, footer) {
    switch (modalType) {
      case Modal.FULLSCREEN:
        return Modal.#fullScreenModal(id, header, body, footer);
      case Modal.CENTRAL:
        return Modal.#centralModal(id, header, body, footer);
      default:
        throw Error('Invalid modal type');
    }
  }

  // #endregion

  // #region Private variables

  /** @type {boolean} */
  #toggled;

  /** @type {string} */
  #id;

  /** @type {BSModal} */
  #bsModal;

  // #endregion

  // #region Public functions

  /**
   * Create a modal.
   *
   * @param {{
   *  parentSelector: JQuery,
   *  type: number,
   *  id: string,
   *  header: string,
   *  body: string,
   *  footer: string,
   *  onClose: () => void|undefined,
   *  startVisible: boolean,
   *  closeOnEscape: boolean
   * }} config
   */
  constructor(config) {
    this.#toggled = config.startVisible;
    this.#id = config.id;
    config.parentSelector.append(
      Modal.#getHTML(config.type, config.id, config.header, config.body, config.footer),
    );
    this.#bsModal = new BSModal($(`#${this.#id}`), { keyboard: config.closeOnEscape });
    if (config.startVisible) this.#bsModal.toggle();
    this.#setOnClose(config.onClose);
  }

  /**
   * Display modal.
   */
  show() {
    if (!this.#toggled) {
      this.#bsModal.toggle();
      this.#toggled = !this.#toggled;
    }
  }

  /**
   * Hide modal.
   */
  hide() {
    if (this.#toggled) {
      this.#bsModal.toggle();
      this.#toggled = !this.#toggled;
    }
  }

  /**
   * Remove modal from dom.
   */
  remove() {
    $(`#${this.#id}`).remove();
  }

  // #endregion

  // #region Private functions

  /**
   * Set up close event.
   *
   * @param {() => void)} callback
   */
  #setOnClose(callback) {
    // TODO: For some reason, hidden.bs.modal isn't working. Temp solution.
    $('body > div.modal-backdrop.show').one('DOMNodeRemoved', (evt) => {
      // Bootstrap (or something) seems to add some trailing ";", remove that, TODO: Find a fix
      const prevSibling = evt.currentTarget.previousSibling;
      if (prevSibling && prevSibling.nodeValue === ';') {
        prevSibling.remove();
      }
      if (callback) {
        callback();
      } else {
        this.remove();
      }
    });
  }

  // #endregion
}

export default Modal;
