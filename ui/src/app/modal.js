import $ from 'jquery';
import { Modal as BootstrapModal } from 'bootstrap';

import { copyToClipboard } from './svgs';
import TilingDisplay from './tiling_display';

import '../utils/typedefs';

import './styles/modal.scss';

/**
 * A modal component that takes over display.
 */
class Modal {
  static clipboardId = 'clipboardcopy';

  /**
   * Create base modal component in html.
   *
   * @returns {string} raw HTML string
   */
  static getHTML() {
    return `<div
      class="modal"
      id="popup"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
          <div class="modal-header">
            ${copyToClipboard(Modal.clipboardId)}
            <button
              id="modal-close"
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body"><div id="popup-content"></div></div>
        </div>
      </div>
    </div>;`;
  }

  /**
   * Create an instance of BS modal.
   *
   * @returns {BootstrapModal} a BS modal object
   */
  static createAndDisplayModalDom() {
    $('body').append(Modal.getHTML());
    const modal = new BootstrapModal(document.getElementById('popup'), { keyboard: false });
    modal.toggle();
    return modal;
  }

  /**
   * Grab html plot from treant node and create a copy of the
   * inner most div possible that contains the image.
   *
   * @param {string} nodeHTML
   * @returns {HTMLDivElement} a div element of tiling drawing
   */
  static transformFigure(nodeHTML) {
    const phantom = document.createElement('div');
    phantom.innerHTML = nodeHTML;
    const div = phantom.children[0].children[1];
    div.classList = ['modal-spec-node'];
    const tableRows = Array.from(div.children[0].children[0].children[0].children);
    const height = tableRows.length;
    tableRows.forEach((row, yOffset) => {
      Array.from(row.children).forEach((tr, xOffset) => {
        if (tr.innerHTML.trim().length > 0) {
          tr.classList.add(`matrix_${xOffset}_${height - yOffset - 1}`, 'non-empty-cell');
        }
      });
    });
    return div;
  }

  /**
   * Display modal.
   *
   * @param {TilingInterface} tiling
   * @param {AppStateInterface} appState
   * @param {string} nodeHTML
   * @param {null|RuleWithoutTilings} rule
   * @param {ErrorDisplayInterface} errorDisplay
   * @param {(newRule: RuleResponse) => void} callback
   */
  static render(tiling, appState, nodeHTML, rule, errorDisplay, callback) {
    (() => new Modal(tiling, appState, nodeHTML, rule, errorDisplay, callback))();
  }

  /**
   * Create modal component.
   *
   * @constructor
   * @param {TilingInterface} tiling
   * @param {AppStateInterface} appState
   * @param {string} nodeHTML
   * @param {null|RuleWithoutTilings} rule
   * @param {ErrorDisplayInterface} errorDisplay
   * @param {(newRule: RuleResponse) => void} callback
   */
  constructor(tiling, appState, nodeHTML, rule, errorDisplay, callback) {
    /** @type {BootstrapModal} */
    this.modal = Modal.createAndDisplayModalDom();
    /** @type {ErrorDisplayInterface} */
    this.errorDisplay = errorDisplay;
    this.errorDisplay.moveToParent($('#popup'));
    this.setCloseEvent();
    Modal.setClipboardEvent(tiling.tilingJson);
    const tilingDisplayDiv = Modal.transformFigure(nodeHTML);
    const tilingDisplayParent = $('#popup-content');
    /** @type {TilingDisplay} */
    this.tilingDisplay = new TilingDisplay(
      tiling,
      appState,
      tilingDisplayDiv,
      rule,
      (newRule) => {
        this.remove();
        callback(newRule);
      },
      tilingDisplayParent,
      (msg) => {
        this.errorDisplay.alert(msg);
      },
    );
  }

  /**
   * Set click event on clipboard icon to store tiling as json
   * in user's clipboard.
   *
   * @param {TilingJson} tilingJson
   */
  static setClipboardEvent(tilingJson) {
    $(`#${Modal.clipboardId}`).on('click', () => {
      navigator.clipboard.writeText(JSON.stringify(tilingJson));
    });
  }

  /**
   * Set close modal event handlers.
   */
  setCloseEvent() {
    $('#popup').on('keydown', (evt) => {
      if (evt.key === 'Escape') {
        this.remove();
      }
    });
    $('#modal-close').on('click', () => {
      this.remove(false);
    });
  }

  /**
   * Hide and destroy the modal.
   *
   * @param {boolean} [toggle] defaults to true
   */
  remove(toggle = true) {
    if (toggle) this.modal.toggle();
    this.errorDisplay.restoreParent();
    $('#popup').remove();
    // Bootstrap (or something) seems to add some trailing ";", remove that, TODO: Find a fix
    document.body.lastChild.remove();
  }
}

export default Modal;
