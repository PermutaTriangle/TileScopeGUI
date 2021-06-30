/**
 * The app's state.
 */
class AppState {
  /**
   * @constructor
   */
  constructor() {
    /** @type {{dir: 'n'|'w'|'s'|'e', row: boolean}} */
    this.rowColPlace = { dir: 'n', row: true };
    /** @type {{patt: string}} */
    this.cellInsert = { patt: '0' };
    /** @type {{dir: 'n'|'w'|'s'|'e', idx: number}} */
    this.reqPlace = { dir: 'n', idx: 0 };
  }

  /**
   * Set pattern for cell insertion.
   *
   * @param {string} patt
   */
  setCellInsertPatt(patt) {
    this.cellInsert.patt = patt;
  }

  /**
   * Get pattern for cell insertion.
   *
   * @returns {string} pattern
   */
  getCellInsertPatt() {
    return this.cellInsert.patt;
  }

  /**
   * Set direction for row/col placement.
   *
   * @param {'n'|'w'|'s'|'e'} dir
   */
  setRowColPlacementDirection(dir) {
    this.rowColPlace.dir = dir;
  }

  /**
   * Get direction for row/col placement.
   *
   * @returns {'n'|'w'|'s'|'e'} direction
   */
  getRowColPlacementDirection() {
    return this.rowColPlace.dir;
  }

  /**
   * Set placeRow for row/col placement.
   *
   * @param {boolean} row
   */
  setRowColPlacementRow(row) {
    this.rowColPlace.row = row;
  }

  /**
   * Get placeRow for row/col placement.
   *
   * @returns {boolean} place row?
   */
  getRowColPlacementRow() {
    return this.rowColPlace.row;
  }

  /**
   * Set direction for requirement placement.
   *
   * @param {'n'|'w'|'s'|'e'} dir
   */
  setReqPlacementDirection(dir) {
    this.reqPlace.dir = dir;
  }

  /**
   * Get direction for requirement placement.
   *
   * @returns {'n'|'w'|'s'|'e'} direction
   */
  getReqPlacementDirection() {
    return this.reqPlace.dir;
  }

  /**
   * Set index for requirement placement.
   *
   * @param {number} idx
   */
  setReqPlacementIdx(idx) {
    this.reqPlace.idx = idx;
  }

  /**
   * Get index for requirement placement.
   *
   * @returns {number} index
   */
  getReqPlacementIdx() {
    return this.reqPlace.idx;
  }
}

export default AppState;
