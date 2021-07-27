import '../utils/typedefs';

/**
 * A tiling representation for JS.
 */
class Tiling {
  // #region Static variables

  /**
   * A regex for extracting consequtive numbers in a string.
   */
  static #basisRegex = /[+-]?\d+(?:\.\d+)?/g;

  // #endregion

  // #region Static functions

  /**
   * Convert a basis string of number with any delimiter to
   * one having '_' as a delimiter.
   *
   * @param {string} basis
   * @returns {string} Empty string if invalid or basis split by `_`
   */
  static convertBasis(basis) {
    const basisArray = basis.match(Tiling.#basisRegex);
    if (!basisArray) return '';
    return basisArray.join('_');
  }

  // #endregion

  // #region Public functions

  /**
   * Construct tiling from a API tiling response.
   *
   * @constructor
   * @param {TilingResponse} tilingResponse
   */
  constructor(tilingResponse) {
    /** @type {TilingPlot} */
    this.plot = tilingResponse.plot;
    /** @type {string} */
    this.key = tilingResponse.key;
    /** @type {VerificationStrategy} */
    this.verified = tilingResponse.verified;
  }

  /**
   * Check if tiling is verified.
   *
   * @returns {boolean} true iff tiling is verified.
   */
  isVerified() {
    return this.verified && Object.keys(this.verified).length;
  }

  /**
   * HTML table of tiling ascii plot.
   *
   * @returns {string} raw HTML for ascii table.
   */
  asciiHTML() {
    return `<table>${this.#gatherTableRows()}</table>`;
  }

  // #endregion

  // #region Private functions

  /**
   * Create color maps from coordinates to string indices.
   *
   * @returns {Object.<string,string[]>}
   */
  #constructColorMap() {
    const colorMap = {};
    this.plot.assumptions.forEach((gps, colorIndex) => {
      gps.forEach((gp) => {
        const coord = gp.split(': ')[1];
        if (coord in colorMap) {
          // If not already capped
          if (colorMap[coord][0] !== 'x') {
            colorMap[coord].push(colorIndex.toString());
          }
          // If there are more than 4 assumptions, we just color the entire cell
          if (colorMap[coord].length > 4) {
            colorMap[coord].length = 1;
            colorMap[coord][0] = 'x';
          }
        } else {
          colorMap[coord] = [colorIndex.toString()];
        }
      });
    });
    return colorMap;
  }

  /**
   * Convert coordinate to class, possibly nothing.
   *
   * @param {nmumber} x
   * @param {number} y
   * @param {Object.<string, string[]>} colorMap
   * @returns {string} class
   */
  #assumptionClass(x, y, colorMap) {
    const key = `(${x}, ${y})`;
    if (key in colorMap) {
      return ` class="assumption-${
        this.plot.assumptions.length > 4 ? 'x' : colorMap[key].join('')
      }"`;
    }
    return '';
  }

  /**
   * Gather rows for tiling.
   *
   * @returns {string} rows html
   */
  #gatherTableRows() {
    const colorMap = this.#constructColorMap();
    const offset = this.plot.matrix.length;
    return this.plot.matrix
      .map((row, r) => `<tr>${this.#gatherTableRowData(offset, colorMap, row, r)}</tr>`)
      .join('');
  }

  /**
   * Gather data in row.
   *
   * @param {number} offset
   * @param {Object.<string, string[]>} colorMap
   * @param {string[]} row
   * @param {number} r
   * @returns {string} row's inner html
   */
  #gatherTableRowData(offset, colorMap, row, r) {
    return row
      .map((data, c) => `<td${this.#assumptionClass(c, offset - r - 1, colorMap)}>${data}</td>`)
      .join('');
  }

  // #endregion
}

export default Tiling;
