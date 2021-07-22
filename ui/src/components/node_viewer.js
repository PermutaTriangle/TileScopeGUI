import $ from 'jquery';

import Modal from './bootstrap_wrappers/modal';
import { copyToClipboard } from './svgs';
import displayTiling from './tiling_display';

import '../utils/typedefs';

import './styles/modal.scss';

/**
 * A modal component that takes over display.
 */
class NodeViewer {
  /**
   * Set click event on clipboard icon to store tiling as json
   * in user's clipboard.
   *
   * @param {TilingJson} tilingJson
   */
  static setClipboardEvent(tilingJson) {
    $('#clipboardcopy').on('click', () => {
      navigator.clipboard.writeText(JSON.stringify(tilingJson));
    });
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
   * Create class view modal.
   *
   * @param {() => void)} callback
   * @returns {Modal} modal
   */
  static constructModal(callback) {
    return new Modal({
      parentSelector: $('body'),
      type: Modal.FULLSCREEN,
      id: 'nodeview',
      header: `${copyToClipboard('clipboardcopy')}${Modal.closeHeaderButton()}`,
      body: '<div id="nodeview-content"></div>',
      footer: '',
      onClose: callback,
      startVisible: true,
      closeOnEscape: true,
    });
  }

  /**
   * Create node view component.
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
    /** @type {Modal} */
    this.modal = NodeViewer.constructModal(() => {
      this.remove();
    });
    /** @type {ErrorDisplayInterface} */
    this.errorDisplay = errorDisplay;
    this.errorDisplay.moveToParent($('#nodeview'));
    // this.setCloseEvent();
    NodeViewer.setClipboardEvent(tiling.tilingJson);
    this.renderTiling(tiling, appState, nodeHTML, rule, callback);
  }

  renderTiling(tiling, appState, nodeHTML, rule, callback) {
    const tilingDisplayDiv = NodeViewer.transformFigure(nodeHTML);
    const tilingDisplayParent = $('#nodeview-content');
    displayTiling(
      tiling,
      appState,
      tilingDisplayDiv,
      rule,
      (newRule) => {
        this.modal.hide();
        callback(newRule);
      },
      tilingDisplayParent,
      (msg) => {
        this.errorDisplay.alert(msg);
      },
    );
  }

  /**
   * Hide and destroy the this component.
   */
  remove() {
    this.errorDisplay.restoreParent();
    this.modal.remove();
  }
}

/**
 * Display class node.
 *
 * @param {TilingInterface} tiling
 * @param {AppStateInterface} appState
 * @param {string} nodeHTML
 * @param {null|RuleWithoutTilings} rule
 * @param {ErrorDisplayInterface} errorDisplay
 * @param {(newRule: RuleResponse) => void} callback
 */
const viewClassNode = (tiling, appState, nodeHTML, rule, errorDisplay, callback) => {
  (() => new NodeViewer(tiling, appState, nodeHTML, rule, errorDisplay, callback))();
};

export default viewClassNode;
