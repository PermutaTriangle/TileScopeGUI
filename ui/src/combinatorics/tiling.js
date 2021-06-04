class Tiling {
  static basisRegex = /[+-]?\d+(?:\.\d+)?/g;

  static convertBasis(basis) {
    const basisArray = basis.match(Tiling.basisRegex);
    return basisArray.join('_');
  }

  constructor(jsonTiling) {
    this.tilingJson = jsonTiling.tiling;
    this.plot = jsonTiling.plot;
    this.key = jsonTiling.key;
    this.verified = jsonTiling.verified;
  }

  asciiHTML() {
    return `<table>${this.plot.matrix
      .map((row) => `<tr><td>${row.join('</td><td>')}</td></tr>`)
      .join('')}</table>`;
  }

  getTilingObject() {
    return this.tilingJson;
  }
}

export default Tiling;
