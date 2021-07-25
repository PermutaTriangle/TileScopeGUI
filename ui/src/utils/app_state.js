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
    /** @type {{row: boolean }} */
    this.fusion = { row: true };
    /** @type {{atom: boolean, locallyFactorable: boolean, insertionEncodable: boolean, oneByOne: boolean, subclass: boolean, shortObstruction: boolean}} */
    this.verificationStrategies = {
      atom: true,
      locallyFactorable: true,
      insertionEncodable: true,
      oneByOne: false,
      subclass: false,
      shortObstruction: false,
    };
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

  /**
   * Set row (or column) for fusion.
   *
   * @param {boolean} row
   */
  setFusionRow(row) {
    this.fusion.row = row;
  }

  /**
   * Get row (or column) for fusion
   *
   * @returns {boolean} fuse rows
   */
  getFusionRow() {
    return this.fusion.row;
  }

  /**
   * Set atom verification.
   *
   * @param {boolean} on
   */
  setAtomVerification(on) {
    this.verificationStrategies.atom = on;
  }

  /**
   * Get atom verification.
   *
   * @returns {boolean} on
   */
  getAtomVerification() {
    return this.verificationStrategies.atom;
  }

  /**
   * Set locally factorable verification.
   *
   * @param {boolean} on
   */
  setLocallyFactorableVerification(on) {
    this.verificationStrategies.locallyFactorable = on;
  }

  /**
   * Get locally factorable verification.
   *
   * @returns {boolean} on
   */
  getLocallyFactorableVerification() {
    return this.verificationStrategies.locallyFactorable;
  }

  /**
   * Set insertion encodable verification.
   *
   * @param {boolean} on
   */
  setInsertionEncodableVerification(on) {
    this.verificationStrategies.insertionEncodable = on;
  }

  /**
   * Get insertion encodable verification.
   *
   * @returns {boolean} on
   */
  getInsertionEncodableVerification() {
    return this.verificationStrategies.insertionEncodable;
  }

  /**
   * Set one by one verification.
   *
   * @param {boolean} on
   */
  setOneByOneVerifciation(on) {
    this.verificationStrategies.oneByOne = on;
  }

  /**
   * Get one by one verification.
   *
   * @returns {boolean} on
   */
  getOneByOneVerifciation() {
    return this.verificationStrategies.oneByOne;
  }

  /**
   * Set subclass verification.
   *
   * @param {boolean} on
   */
  setSubclassVerification(on) {
    this.verificationStrategies.subclass = on;
  }

  /**
   * Get subclass verification.
   *
   * @returns {boolean} on
   */
  getSubclassVerification() {
    return this.verificationStrategies.subclass;
  }

  /**
   * Set short obstruction verification.
   *
   * @param {boolean} on
   */
  setShortObstructionVerification(on) {
    this.verificationStrategies.shortObstruction = on;
  }

  /**
   * Get short obstruction verification.
   *
   * @returns {boolean} on
   */
  getShortObstructionVerification() {
    return this.verificationStrategies.shortObstruction;
  }
}

export default AppState;
