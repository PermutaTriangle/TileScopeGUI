import '../utils/typedefs';

/**
 * A tiling representation for JS.
 */
class Tiling {
  /**
   * A regex for extracting consequtive numbers in a string.
   */
  static basisRegex = /[+-]?\d+(?:\.\d+)?/g;

  /**
   * Convert a basis string of number with any delimiter to
   * one having '_' as a delimiter.
   *
   * @param {string} basis
   * @returns {string} Empty string if invalid or basis split by `_`
   */
  static convertBasis(basis) {
    const basisArray = basis.match(Tiling.basisRegex);
    if (!basisArray) return '';
    return basisArray.join('_');
  }

  /**
   * Construct tiling from a API tiling response.
   *
   * @constructor
   * @param {TilingResponse} tilingResponse
   */
  constructor(tilingResponse) {
    /** @type {TilingJson} */
    this.tilingJson = tilingResponse.tiling;
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
    const colorMap = {};
    this.plot.assumptions.forEach((gps, colorIndex) => {
      gps.forEach((gp) => {
        const coord = gp.split(': ')[1];
        if (coord in colorMap) {
          if (colorMap[coord][0] !== 'x') {
            colorMap[coord].push(colorIndex.toString());
          }
          if (colorMap[coord].length > 4) {
            colorMap[coord].length = 1;
            colorMap[coord][0] = 'x';
          }
        } else {
          colorMap[coord] = [colorIndex.toString()];
        }
      });
    });
    const assumptionClass = (x, y) => {
      const key = `(${x}, ${y})`;
      if (key in colorMap) {
        return ` class="assumption-${
          this.plot.assumptions.length > 4 ? 'x' : colorMap[key].join('')
        }"`;
      }
      return '';
    };
    const offset = this.plot.matrix.length;
    return `<table>${this.plot.matrix
      .map(
        (row, r) =>
          `<tr>${row
            .map((data, c) => `<td${assumptionClass(c, offset - r - 1)}>${data}</td>`)
            .join('')}</tr>`,
      )
      .join('')}</table>`;
  }

  /**
   * Get tiling json.
   *
   * @returns {TilingJson} The tiling in json format.
   */
  getTilingObject() {
    return this.tilingJson;
  }
}

export default Tiling;
