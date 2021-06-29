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
    return `<table>${this.plot.matrix
      .map((row) => `<tr><td>${row.join('</td><td>')}</td></tr>`)
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
