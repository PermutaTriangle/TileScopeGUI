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
}

export default AppState;
