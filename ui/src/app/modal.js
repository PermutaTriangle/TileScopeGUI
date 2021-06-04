import './styles/modal.scss';

import $ from 'jquery';
import { Modal as BootstrapModal } from 'bootstrap';

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
            <h5 class="modal-title" id="exampleModalLabel">Expand</h5>
            <button
              id="modal-close"
              type="button"
              class="btn btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body"><div id="popup-content"></div></div>
        </div>
      </div>
    </div>;`;
  }

  constructor(tiling, nodeHTML, expanded, callback) {
    this.tiling = tiling;
    this.expanded = expanded;
    $('body').append(Modal.getHTML());
    const model = new BootstrapModal(document.getElementById('popup'), { keyboard: false });
    model.show();
    $('#modal-close').on('click', () => {
      $('#popup').remove();
      document.body.lastChild.remove(); // Bootstrap seems to add some trailing ";", remove that
    });
    this.baseDiv = Modal.createFigure(nodeHTML);
    this.addTopFigure();
    $('#popup-content').append('<Button id="copy-json">JSON</Button>');
    $('#copy-json').on('click', () => {
      navigator.clipboard.writeText(JSON.stringify(this.tiling.tilingJson));
    });
    if (this.tiling.plot.crossing) {
      $('#popup-content').append('<p>Crossing obstructions</p>');
      $('#popup-content').append(
        `<ol>${this.tiling.plot.crossing.map((v) => `<li>${v}</li>`).join('')}</ol>`,
      );
    }
    if (this.tiling.plot.requirements) {
      $('#popup-content').append('<p>Requirements</p>');
      $('#popup-content').append(
        `<ol>${this.tiling.plot.requirements.map((v) => `<li>${v}</li>`).join('')}</ol>`,
      );
    }

    $('#popup-content').append('<h6>Strategies</h6><p>TODO</p>');
  }

  static createFigure(nodeHTML) {
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

  addTopFigure() {
    const container = document.createElement('div');
    container.id = 'top-modal-figure';
    container.append(this.baseDiv);
    $('#popup-content').append(container);
  }
}

export default Modal;
