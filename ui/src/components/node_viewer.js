import $ from 'jquery';

import Modal from './bootstrap_wrappers/modal';
import { copyToClipboard } from './svgs';
import displayTiling from './tiling_display';

import '../utils/typedefs';

import './styles/node_viewer.scss';
import { decodeTilings, replOfTiling } from '../consumers/service';
import statusCode from '../consumers/status_codes';

/**
 * A modal component that takes over display.
 */
class NodeViewer {
  // #region Static functions

  /**
   * Get tilling json.
   *
   * @async
   * @param {string} tilingKey
   * @returns {Promise.<Array.<boolean|string>>} error and data tuple
   */
  static async #getTilingJson(tilingKey) {
    const response = await decodeTilings([tilingKey]);
    if (response.status !== statusCode.OK) return [false, null];
    return [true, JSON.stringify(response.data[0])];
  }

  /**
   * Get tiling repl.
   *
   * @async
   * @param {string} tilingKey
   * @returns {Promise.<Array.<boolean|string>>} error and data tuple
   */
  static async #getTilingRepl(tilingKey) {
    const response = await replOfTiling(tilingKey);
    if (response.status !== statusCode.OK) return [false, null];
    return [true, response.data];
  }

  /**
   * Create a new div from a class table html.
   *
   * @param {string} nodeHTML
   * @returns {{div: Element, tableRows: Element[], height: number}}
   */
  static #createNewClassDiv(nodeHTML) {
    const phantom = document.createElement('div');
    phantom.innerHTML = nodeHTML;
    const div = phantom.children[0].children[1];
    div.classList = ['modal-spec-node'];
    const tableRows = Array.from(div.children[0].children[0].children[0].children);
    const height = tableRows.length;
    return { div, tableRows, height };
  }

  /**
   * Grab html plot from treant node and create a copy of the
   * inner most div possible that contains the image.
   *
   * @param {string} nodeHTML
   * @returns {HTMLDivElement} a div element of tiling drawing
   */
  static #transformFigure(nodeHTML) {
    const { div, tableRows, height } = NodeViewer.#createNewClassDiv(nodeHTML);
    tableRows.forEach((row, yOffset) => {
      Array.from(row.children).forEach((td, xOffset) => {
        if (td.innerHTML.trim().length > 0) {
          td.classList.add(`matrix_${xOffset}_${height - yOffset - 1}`, 'non-empty-cell');
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
  static #constructModal(callback) {
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

  // #endregion

  // #region Private instance variables

  /** @type {Modal} */
  #modal;

  /** @type {ErrorDisplayInterface} */
  #errorDisplay;

  /** @type {AppStateInterface} */
  #appState;

  // #endregion

  // #region public methods

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
    this.#appState = appState;
    this.#modal = NodeViewer.#constructModal(() => {
      this.#remove();
    });
    this.#errorDisplay = errorDisplay;
    this.#errorDisplay.moveToParent($('#nodeview'));
    this.#setClipboardEvent(tiling.key);
    this.#renderTiling(tiling, appState, nodeHTML, rule, callback);
  }

  // #endregion

  // #region Private functions

  /**
   * Get preferred copy data.
   *
   * @async
   * @param {string} tilingKey
   * @returns {Promise.<Array.<boolean|string>>}
   */
  async #getCopyData(tilingKey) {
    if (this.#appState.getClipboardCopy()) {
      return NodeViewer.#getTilingJson(tilingKey);
    }
    return NodeViewer.#getTilingRepl(tilingKey);
  }

  /**
   * Set click event on clipboard icon to store tiling as json
   * in user's clipboard.
   *
   * @param {string} tilingKey
   */
  #setClipboardEvent(tilingKey) {
    $('#clipboardcopy').on('click', async () => {
      const [valid, copyStr] = await this.#getCopyData(tilingKey);
      if (valid) {
        navigator.clipboard.writeText(copyStr);
      } else {
        this.#errorDisplay.alert('Failed to copy');
      }
    });
  }

  #renderTiling(tiling, appState, nodeHTML, rule, callback) {
    const tilingDisplayDiv = NodeViewer.#transformFigure(nodeHTML);
    const tilingDisplayParent = $('#nodeview-content');
    displayTiling(
      tiling,
      appState,
      tilingDisplayDiv,
      rule,
      (newRule) => {
        this.#modal.hide();
        callback(newRule);
      },
      tilingDisplayParent,
      (msg) => {
        this.#errorDisplay.alert(msg);
      },
    );
  }

  /**
   * Hide and destroy the this component.
   */
  #remove() {
    this.#errorDisplay.restoreParent();
    this.#modal.remove();
  }

  // #endregion
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
