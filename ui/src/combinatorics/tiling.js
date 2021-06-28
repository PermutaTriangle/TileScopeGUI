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
   */
  static convertBasis(basis) {
    const basisArray = basis.match(Tiling.basisRegex);
    if (!basisArray) return '';
    return basisArray.join('_');
  }

  /**
   * Construct tiling from a API tiling response.
   */
  constructor(jsonTiling) {
    this.tilingJson = jsonTiling.tiling;
    this.plot = jsonTiling.plot;
    this.key = jsonTiling.key;
    this.verified = jsonTiling.verified;
  }

  isVerified() {
    return this.verified && Object.keys(this.verified).length;
  }

  /**
   * HTML table of tiling ascii plot.
   */
  asciiHTML() {
    return `<table>${this.plot.matrix
      .map((row) => `<tr><td>${row.join('</td><td>')}</td></tr>`)
      .join('')}</table>`;
  }

  /**
   * Tiling json for python.
   */
  getTilingObject() {
    return this.tilingJson;
  }
}

export default Tiling;
