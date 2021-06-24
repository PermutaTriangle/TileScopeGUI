import { apiPost } from './instance';

/**
 * An endpoint for fetching tiling from basis or json.
 */
const getTiling = async (basisOrJson) => apiPost('/tiling/init', basisOrJson);

/**
 * An endpoint for getting row/col placement rule given a tiling.
 */
const rowCol = async (tilingJson, direction) =>
  apiPost('/strategies/rowcol', { tiling: tilingJson, dir: direction });

/**
 * An endpoint for getting a factor rule give a tiling.
 */
const factor = async (tilingJson) => apiPost('/strategies/factor', tilingJson);

export { getTiling, rowCol, factor };
