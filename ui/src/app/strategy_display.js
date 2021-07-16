import $ from 'jquery';

import statusCodes from '../consumers/status_codes';

import {
  rowColPlacement,
  factor,
  cellInsertion,
  rowColSeparation,
  reqPlacement,
  addAssumption,
  fusion,
  obstructionTransivity,
  sliding,
  symmetries,
  rearrangeAssumption,
} from '../consumers/service';
import { accordionItem } from '../utils/dom_utils';
import { boxedArrowN, boxedArrowW, boxedArrowS, boxedArrowE } from './svgs';
import { directionStringToNumber, allSymmetries } from '../utils/permuta_utils';

import '../utils/typedefs';

import './styles/strategy_display.scss';

/**
 * A component for displaying expansion strategies.
 */
class StrategyDisplay {
  /**
   * Extract coordinates from class name.
   *
   * @param {string} className
   * @returns {number[]} pair of coordinates
   */
  static getCoordsFromCellClickEvent(className) {
    const pattern = /matrix_([\d+])_([\d+])/gm;
    const [, x, y] = pattern.exec(className);
    return [+x, +y];
  }

  /**
   * Create a table of directional arrows.
   *
   * @param {string} idPrefix
   * @param {'n'|'w'|'s'|'e'} initialToggle
   * @param {number} size
   * @returns {string} raw HTML string
   */
  static directionTable(idPrefix, initialToggle, size) {
    const north = `<td id="${idPrefix}-n" class="${idPrefix}-togglable dir-togglable${
      initialToggle === 'n' ? ' dir-toggled' : ''
    }">${boxedArrowN(null, size, size)}</td>`;
    const west = `<td id="${idPrefix}-w" class="${idPrefix}-togglable dir-togglable${
      initialToggle === 'w' ? ' dir-toggled' : ''
    }">${boxedArrowW(null, size, size)}</td>`;
    const east = `<td id="${idPrefix}-e" class="${idPrefix}-togglable dir-togglable${
      initialToggle === 'e' ? ' dir-toggled' : ''
    }">${boxedArrowE(null, size, size)}</td>`;
    const south = `<td id="${idPrefix}-s" class="${idPrefix}-togglable dir-togglable${
      initialToggle === 's' ? ' dir-toggled' : ''
    }">${boxedArrowS(null, size, size)}</td>`;
    return `<table>
      <tr><td></td>${north}<td></td></tr>
      <tr>${west}<td></td>${east}</tr>
      <tr><td></td>${south}<td></td></tr>
      </table>`;
  }

  /**
   * Create strategy display component.
   *
   * @constructor
   * @param {TilingInterface} tiling
   * @param {AppStateInterface} appState
   * @param {HTMLDivElement} plotDiv
   * @param {(newRule: RuleResponse) => void} callback
   * @param {JQuery} parentDom
   * @param {(msg: string) => void} errorMsg
   */
  constructor(tiling, appState, plotDiv, callback, parentDom, errorMsg) {
    /** @type {TilingInterface} */
    this.tiling = tiling;
    /** @type {AppStateInterface} */
    this.appState = appState;
    /** @type {string} */
    this.plotDiv = plotDiv.outerHTML;
    /** @type {(newRule: RuleResponse) => void} */
    this.callback = callback;
    /** @type {JQuery} */
    this.parentDom = parentDom;
    /** @type {(msg: string) => void} */
    this.errorMsg = errorMsg;
  }

  /**
   * Display error message given status code.
   *
   * @param {number} status
   */
  displayError(status) {
    if (status < 0) {
      this.errorMsg('Server unavailable');
    } else {
      this.errorMsg('Strategy does not apply');
    }
  }

  /**
   * Take the appropriate action given response from server.
   *
   * @param {{status: number, data: null|RuleResponse}} res
   */
  handleResponse(res) {
    if (res.status === statusCodes.OK) {
      this.callback(res.data);
    } else {
      this.displayError(res.status);
    }
  }

  /**
   * Add components to dom elements.
   */
  plot() {
    let accordionItemId = 4;
    /** @returns {number} */
    const getId = () => {
      accordionItemId += 1;
      return accordionItemId;
    };
    // Order displayed
    this.addFactorUI(getId());
    this.addRowColSeparationUI(getId());
    this.addObstructionTransivityUI(getId());
    this.addRowColPlacementUI(getId());
    this.addCellInsertionUI(getId());
    this.addReqPlacementUI(getId());
    this.addSlidingUI(getId());
    this.addFusionUi(getId());
    this.addAssumptionUI(getId());
    this.addRearrangeAssumptionUI(getId());
    this.addSymmetryUI(getId());
  }

  // #region Obstruction transivity

  addObstructionTransivityUI(acId) {
    const content = `<button id="obstra">Obstruction transivity</button>`;
    this.parentDom.append(accordionItem(acId, 'Obstruction transivity', content));
    $('#obstra').on('click', async () => {
      const res = await obstructionTransivity(this.tiling.tilingJson);
      this.handleResponse(res);
    });
  }

  // #endregion

  // #region Cell insertion

  /**
   *
   */
  addCellInsertionUI(acId) {
    const content = `<div id="cell-ins-fig" class="cell-hoverable">${this.plotDiv}</div>`;
    this.parentDom.append(accordionItem(acId, 'Cell insertion', content));
    $('#cell-ins-fig .non-empty-cell').on('click', async (evt) => {
      const [x, y] = StrategyDisplay.getCoordsFromCellClickEvent(evt.currentTarget.className);
      const res = await cellInsertion(this.tiling.tilingJson, x, y, '0');
      this.handleResponse(res);
    });
  }

  // #endregion

  // #region Factor

  addFactorUI(acId) {
    const content = `<div><button id="factor">Factor</button><button id="factorint">Interleaving</button></div>`;
    this.parentDom.append(accordionItem(acId, 'Factor', content));
    $('#factor').on('click', async () => {
      const res = await factor(this.tiling.tilingJson);
      this.handleResponse(res);
    });
    $('#factorint').on('click', async () => {
      const res = await factor(this.tiling.tilingJson, true);
      this.handleResponse(res);
    });
  }

  // #endregion

  // #region Row/Col placement

  getRowColPlacementRowColRadioButtons() {
    const row = this.appState.getRowColPlacementRow();
    const colChecked = row ? '' : ' checked';
    const rowChecked = row ? ' checked' : '';
    return `<div id="rcp-row" class="btn-group" role="group" aria-label="Basic radio toggle button group">
    <input type="radio" class="btn-check" name="rcp-btn" id="rcp-sel-r" autocomplete="off"${rowChecked}>
    <label class="btn btn-outline-primary" for="rcp-sel-r">Row</label>
    <input type="radio" class="btn-check" name="rcp-btn" id="rcp-sel-c" autocomplete="off"${colChecked}>
    <label class="btn btn-outline-primary" for="rcp-sel-c">Column</label>
  </div>`;
  }

  addRowColPlacementAddToDom(acId) {
    const arrows = StrategyDisplay.directionTable(
      'rcp',
      this.appState.getRowColPlacementDirection(),
      35,
    );
    const rowcol = this.getRowColPlacementRowColRadioButtons();
    const content = `<div id="row-col-plc-fig" class="cell-hoverable">${this.plotDiv}</div>${arrows}${rowcol}`;
    this.parentDom.append(accordionItem(acId, 'Row/Column placement', content));
  }

  addRowColPlacementSetEvents() {
    $('.rcp-togglable').on('click', (evt) => {
      const newDirection = evt.currentTarget.id.slice(-1);
      const oldDirection = this.appState.getRowColPlacementDirection();
      if (oldDirection !== newDirection) {
        $(`#rcp-${oldDirection}`).removeClass('dir-toggled');
        evt.currentTarget.classList.add('dir-toggled');
        this.appState.setRowColPlacementDirection(newDirection);
      }
    });

    $('#rcp-row > input').on('change', (evt) => {
      this.appState.setRowColPlacementRow(evt.currentTarget.id.slice(-1) === 'r');
    });

    $('#row-col-plc-fig .non-empty-cell').on('click', async (evt) => {
      const dir = directionStringToNumber(this.appState.getRowColPlacementDirection());
      const row = this.appState.getRowColPlacementRow();
      const [x, y] = StrategyDisplay.getCoordsFromCellClickEvent(evt.currentTarget.className);
      const idx = row ? y : x;
      const res = await rowColPlacement(this.tiling.tilingJson, dir, row, idx);
      this.handleResponse(res);
    });
  }

  addRowColPlacementUI(acId) {
    this.addRowColPlacementAddToDom(acId);
    this.addRowColPlacementSetEvents();
  }

  // #endregion

  // #region Row/Col separation

  addRowColSeparationUI(acId) {
    const content = `<button id="separate">Separate</button>`;
    this.parentDom.append(accordionItem(acId, 'Row/Column separation', content));
    $('#separate').on('click', async () => {
      const res = await rowColSeparation(this.tiling.tilingJson);
      this.handleResponse(res);
    });
  }

  // #endregion

  // #region Requirement palcement

  addReqPlacementUI(acId) {
    const arrows = StrategyDisplay.directionTable(
      'reqp',
      this.appState.getReqPlacementDirection(),
      35,
    );
    const content = `<div id="req-plc-fig" class="cell-hoverable">${this.plotDiv}</div>${arrows}`;
    this.parentDom.append(accordionItem(acId, 'Requirement placement', content));

    $('.reqp-togglable').on('click', (evt) => {
      const newDirection = evt.currentTarget.id.slice(-1);
      const oldDirection = this.appState.getReqPlacementDirection();
      if (oldDirection !== newDirection) {
        $(`#reqp-${oldDirection}`).removeClass('dir-toggled');
        evt.currentTarget.classList.add('dir-toggled');
        this.appState.setReqPlacementDirection(newDirection);
      }
    });

    $('#req-plc-fig .non-empty-cell').on('click', async (evt) => {
      const dir = directionStringToNumber(this.appState.getReqPlacementDirection());
      const idx = this.appState.getReqPlacementIdx();
      const [x, y] = StrategyDisplay.getCoordsFromCellClickEvent(evt.currentTarget.className);
      const res = await reqPlacement(this.tiling.tilingJson, x, y, idx, dir);
      this.handleResponse(res);
    });
  }

  // #endregion

  // #region Add assumption

  addAssumptionUI(acId) {
    const btn = `<button id="add-ass-btn">Add assumption</button>`;
    const content = `<div id="add-ass" class="cell-hoverable">${this.plotDiv}</div>${btn}`;
    this.parentDom.append(accordionItem(acId, 'Add assumption', content));

    $('#add-ass td.non-empty-cell').on('click', (evt) => {
      if ($(evt.currentTarget).hasClass('add-ass-toggle')) {
        $(evt.currentTarget).removeClass('add-ass-toggle');
      } else {
        $(evt.currentTarget).addClass('add-ass-toggle');
      }
    });

    $('#add-ass-btn').on('click', async () => {
      const pos = [];
      $('#add-ass td.add-ass-toggle').each((_, e) => {
        pos.push(StrategyDisplay.getCoordsFromCellClickEvent(e.className));
      });
      if (pos.length === 0) {
        this.errorMsg('No assumption added');
      } else {
        const res = await addAssumption(this.tiling.tilingJson, pos);
        this.handleResponse(res);
      }
    });
  }

  // #endregion

  // #region Fusion

  addFusionUi(acId) {
    const initRow = this.appState.getFusionRow();
    const colChecked = initRow ? '' : ' checked';
    const rowChecked = initRow ? ' checked' : '';
    const rowCol = `<div id="fusion-row" class="btn-group" role="group" aria-label="Basic radio toggle button group">
      <input type="radio" class="btn-check" name="fus-btn" id="fusion-sel-r" autocomplete="off"${rowChecked}>
      <label class="btn btn-outline-primary" for="fusion-sel-r">Row</label>
      <input type="radio" class="btn-check" name="fus-btn" id="fusion-sel-c" autocomplete="off"${colChecked}>
      <label class="btn btn-outline-primary" for="fusion-sel-c">Column</label>
    </div>`;

    const content = `<div id="fusion-fig" class="cell-hoverable">${this.plotDiv}</div>${rowCol}`;
    this.parentDom.append(accordionItem(acId, 'Fusion', content));

    $('#fusion-row > input').on('change', (evt) => {
      this.appState.setFusionRow(evt.currentTarget.id.slice(-1) === 'r');
    });

    $('#fusion-fig .non-empty-cell').on('click', async (evt) => {
      const [x, y] = StrategyDisplay.getCoordsFromCellClickEvent(evt.currentTarget.className);
      const row = this.appState.getFusionRow();
      const idx = row ? y : x;
      const res = await fusion(this.tiling.tilingJson, idx, row);
      this.handleResponse(res);
    });
  }
  // #endregion

  // #region Sliding

  addSlidingUI(acId) {
    const btn = `<button id="sliding-btn">Slide</button>`;
    const content = `<div id="sliding" class="cell-hoverable">${this.plotDiv}</div>${btn}`;
    this.parentDom.append(accordionItem(acId, 'Sliding', content));
    $('#sliding td.non-empty-cell').on('click', (evt) => {
      if ($(evt.currentTarget).hasClass('sliding-toggle')) {
        $(evt.currentTarget).removeClass('sliding-toggle');
      } else if ($('#sliding td.sliding-toggle').length < 2) {
        $(evt.currentTarget).addClass('sliding-toggle');
      } else {
        this.errorMsg('Can only slide two cells');
      }
    });

    $('#sliding-btn').on('click', async () => {
      const pos = [];
      $('#sliding td.sliding-toggle').each((_, e) => {
        pos.push(StrategyDisplay.getCoordsFromCellClickEvent(e.className));
      });
      if (pos.length !== 2) {
        this.errorMsg('Must choose two cells');
      } else {
        const [idx1, idx2] =
          pos[0][0] === pos[1][0] ? [pos[0][1], pos[1][1]] : [pos[0][0], pos[1][0]];
        const res = await sliding(this.tiling.tilingJson, idx1, idx2);
        this.handleResponse(res);
      }
    });
  }

  // #endregion

  // #region Symmetries

  addSymmetryUI(acId) {
    const syms = allSymmetries();
    const content = `<div>${syms
      .map(([title, sType]) => `<button id="symmetry-btn-${sType}">${title}</button>`)
      .join('')}</div>`;
    this.parentDom.append(accordionItem(acId, 'Symmetries', content));

    syms.forEach(([, id]) => {
      $(`#symmetry-btn-${id}`).on('click', async (evt) => {
        const symType = parseInt(evt.currentTarget.id.slice(-1), 10);
        const res = await symmetries(this.tiling.tilingJson, symType);
        this.handleResponse(res);
      });
    });
  }

  // #endregion

  // #region Rearrange Assumption

  addRearrangeAssumptionUI(acId) {
    const content = `<button id="rearrassump">Rearrange Assumption</button>`;
    this.parentDom.append(accordionItem(acId, 'Rearrange Assumption', content));
    $('#rearrassump').on('click', async () => {
      const res = await rearrangeAssumption(this.tiling.tilingJson);
      this.handleResponse(res);
    });
  }

  // #endregion
}

export default StrategyDisplay;
