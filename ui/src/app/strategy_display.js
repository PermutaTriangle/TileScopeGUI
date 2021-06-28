import $ from 'jquery';

import statusCodes from '../consumers/status_codes';

import { rowColPlacement, factor, cellInsertion, rowColSeparation } from '../consumers/service';
import { accordionItem } from '../utils/dom_utils';
import { boxedArrowN, boxedArrowW, boxedArrowS, boxedArrowE } from './svgs';
import { directionStringToNumber } from '../utils/permuta_utils';

import './styles/strategy_display.scss';

class StrategyDisplay {
  static getCoordsFromCellClickEvent(className) {
    const pattern = /matrix_([\d+])_([\d+])/gm;
    const [, x, y] = pattern.exec(className);
    return [+x, +y];
  }

  constructor(tiling, appState, plotDiv, callback, parentDom, errorMsg) {
    this.tiling = tiling;
    this.appState = appState;
    this.plotDiv = plotDiv.outerHTML;
    this.callback = callback;
    this.parentDom = parentDom;
    this.errorMsg = errorMsg;
  }

  displayError(status) {
    if (status < 0) {
      this.errorMsg('Server unavailable');
    } else {
      this.errorMsg('Strategy does not apply');
    }
  }

  handleResponse(res) {
    if (res.status === statusCodes.OK) {
      this.callback(res.data);
    } else {
      this.displayError(res.status);
    }
  }

  plot() {
    this.addCellInsertionUI();
    this.addFactorUI();
    this.addRowColPlacementUI();
    this.addRowColSeparationUI();
  }

  // #region Cell insertion

  /**
   *
   */
  addCellInsertionUI() {
    // TODO: any pattern and I guess we need to specify index within cell when multiple points
    const content = `<div id="cell-ins-fig" class="cell-hoverable">${this.plotDiv}</div>`;
    this.parentDom.append(accordionItem(5, 'Cell insertion', content));
    $('#cell-ins-fig .non-empty-cell').on('click', async (evt) => {
      const [x, y] = StrategyDisplay.getCoordsFromCellClickEvent(evt.currentTarget.className);
      const res = await cellInsertion(this.tiling.tilingJson, x, y, '0');
      this.handleResponse(res);
    });
  }

  // #endregion

  // #region Factor

  addFactorUI() {
    const content = `<button id="factor">Factor</button>`;
    this.parentDom.append(accordionItem(6, 'Factor', content));
    $('#factor').on('click', async () => {
      const res = await factor(this.tiling.tilingJson);
      this.handleResponse(res);
    });
  }

  // #endregion

  // #region Row/Col placement

  getRowColPlacementDirectionTable() {
    const toggled = this.appState.getRowColPlacementDirection();
    const north = `<td id="rcp-n" class="rcp-togglable${
      toggled === 'n' ? ' rcp-toggled' : ''
    }">${boxedArrowN(null, 35, 35)}</td>`;
    const west = `<td id="rcp-w" class="rcp-togglable${
      toggled === 'w' ? ' rcp-toggled' : ''
    }">${boxedArrowW(null, 35, 35)}</td>`;
    const east = `<td id="rcp-e" class="rcp-togglable${
      toggled === 'e' ? ' rcp-toggled' : ''
    }">${boxedArrowE(null, 35, 35)}</td>`;
    const south = `<td id="rcp-s" class="rcp-togglable${
      toggled === 's' ? ' rcp-toggled' : ''
    }">${boxedArrowS(null, 35, 35)}</td>`;
    return `<table>
      <tr><td></td>${north}<td></td></tr>
      <tr>${west}<td></td>${east}</tr>
      <tr><td></td>${south}<td></td></tr>
      </table>`;
  }

  getRowColPlacementRowColRadioButtons() {
    const row = this.appState.getRowColPlacementRow();
    const colChecked = row ? '' : ' checked';
    const rowChecked = row ? ' checked' : '';
    return `<div id="rcp-row" class="btn-group" role="group" aria-label="Basic radio toggle button group">
    <input type="radio" class="btn-check" name="btnradio" id="rcp-sel-r" autocomplete="off"${rowChecked}>
    <label class="btn btn-outline-primary" for="rcp-sel-r">Row</label>
    <input type="radio" class="btn-check" name="btnradio" id="rcp-sel-c" autocomplete="off"${colChecked}>
    <label class="btn btn-outline-primary" for="rcp-sel-c">Column</label>
  </div>`;
  }

  addRowColPlacementAddToDom() {
    const arrows = this.getRowColPlacementDirectionTable();
    const rowcol = this.getRowColPlacementRowColRadioButtons();
    const content = `<div id="row-col-plc-fig" class="cell-hoverable">${this.plotDiv}</div>${arrows}${rowcol}`;
    this.parentDom.append(accordionItem(7, 'Row/Column placement', content));
  }

  addRowColPlacementSetEvents() {
    $('.rcp-togglable').on('click', (evt) => {
      const newDirection = evt.currentTarget.id.slice(-1);
      const oldDirection = this.appState.getRowColPlacementDirection();
      if (oldDirection !== newDirection) {
        $(`#rcp-${oldDirection}`).removeClass('rcp-toggled');
        evt.currentTarget.classList.add('rcp-toggled');
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

  addRowColPlacementUI() {
    this.addRowColPlacementAddToDom();
    this.addRowColPlacementSetEvents();
  }

  // #endregion

  // #region Row/Col separation

  addRowColSeparationUI() {
    const content = `<button id="separate">Separate</button>`;
    this.parentDom.append(accordionItem(8, 'Row/Column separation', content));
    $('#separate').on('click', async () => {
      const res = await rowColSeparation(this.tiling.tilingJson);
      this.handleResponse(res);
    });
  }

  // #endregion
}

export default StrategyDisplay;
