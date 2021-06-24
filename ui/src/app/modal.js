import './styles/modal.scss';

import $ from 'jquery';
import { Modal as BootstrapModal } from 'bootstrap';

import TilingDisplay from './tiling_display';

class Modal {
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
            <h5 class="modal-title" id="exampleModalLabel">TEMP TITLE (replace with btns)</h5>
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

  static createAndDisplayModalDom() {
    $('body').append(Modal.getHTML());
    const modal = new BootstrapModal(document.getElementById('popup'), { keyboard: false });
    modal.toggle();
    return modal;
  }

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

  static render(tiling, nodeHTML, expanded, errorDisplay, callback) {
    (() => new Modal(tiling, nodeHTML, expanded, errorDisplay, callback))();
  }

  constructor(tiling, nodeHTML, expanded, errorDisplay, callback) {
    this.modal = Modal.createAndDisplayModalDom();
    this.errorDisplay = errorDisplay;
    this.errorDisplay.moveToParent($('#popup'));
    this.setCloseEvent();
    const tilingDisplayDiv = Modal.transformFigure(nodeHTML);
    const tilingDisplayParent = $('#popup-content');
    this.tilingDisplay = new TilingDisplay(
      tiling,
      tilingDisplayDiv,
      expanded,
      (...args) => {
        this.remove();
        callback(...args);
      },
      tilingDisplayParent,
    );
  }

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

  remove(toggle = true) {
    if (toggle) this.modal.toggle();
    this.errorDisplay.restoreParent();
    $('#popup').remove();
    // Bootstrap (or something) seems to add some trailing ";", remove that, TODO: Find a fix
    document.body.lastChild.remove();
  }
}

export default Modal;
