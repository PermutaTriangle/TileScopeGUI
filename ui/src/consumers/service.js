import { apiPost } from './instance';

/**
 * An endpoint for fetching tiling from basis or json.
 */
const getTiling = async (basisOrJson) => apiPost('/tiling/init', basisOrJson);

/**
 * An endpoint for getting row/col placement rule given a tiling.
 */
const rowColPlacement = async (tilingJson, dir, row, idx) =>
  apiPost('/strategies/rowcolplace', { tiling: tilingJson, dir, row, idx });

/**
 * An endpoint for getting a factor rule give a tiling.
 */
const factor = async (tilingJson) => apiPost('/strategies/factor', tilingJson);

const cellInsertion = async (tilingJson, x, y, patt) =>
  apiPost('/strategies/cellinsertion', { tiling: tilingJson, x, y, patt });

const rowColSeparation = async (tilingJson) => apiPost('/strategies/rowcolsep', tilingJson);

export { getTiling, rowColPlacement, factor, cellInsertion, rowColSeparation };
