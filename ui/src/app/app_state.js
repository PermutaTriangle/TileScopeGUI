class AppState {
  constructor() {
    this.rowColPlace = { dir: 'n', row: true };
    this.cellInsert = { patt: '0' };
  }

  setCellInsertPatt(patt) {
    this.cellInsert.patt = patt;
  }

  getCellInsertPatt() {
    return this.cellInsert.patt;
  }

  setRowColPlacementDirection(dir) {
    this.rowColPlace.dir = dir;
  }

  getRowColPlacementDirection() {
    return this.rowColPlace.dir;
  }

  setRowColPlacementRow(row) {
    this.rowColPlace.row = row;
  }

  getRowColPlacementRow() {
    return this.rowColPlace.row;
  }
}

export default AppState;
