import { apiPost } from './instance';

import '../utils/typedefs';

/**
 * An endpoint for fetching tiling from basis or json.
 *
 * @async
 * @param {string|TilingJson} basisOrJson
 * @returns {Promise.<{status: number, data: null|TilingResponse}>} A response with tiling.
 */
const getTiling = async (basisOrJson) => apiPost('/tiling/init', basisOrJson);

/**
 * An endpoint for getting row/col placement rule given a tiling.
 *
 * @async
 * @param {TilingJson} tilingJson
 * @param {0|1|2|3} dir
 * @param {boolean} row
 * @param {int} idx
 * @returns {RuleResponsePromise} response with rule
 */
const rowColPlacement = async (tilingJson, dir, row, idx) =>
  apiPost('/strategies/rowcolplace', { tiling: tilingJson, dir, row, idx });
/**
 * An endpoint for getting a factor rule given a tiling.
 *
 * @param {TilingJson} tilingJson
 * @returns {RuleResponsePromise}
 */
const factor = async (tilingJson) => {
  const res = await apiPost('/strategies/factor', tilingJson);
  console.log(res);
  return res;
};

/**
 * An endpoint for getting a cell insertion rule given a tiling.
 *
 * @param {TilingJson} tilingJson
 * @param {number} x
 * @param {number} y
 * @param {string} patt
 * @returns {RuleResponsePromise}
 */
const cellInsertion = async (tilingJson, x, y, patt) => {
  const res = await apiPost('/strategies/cellinsertion', { tiling: tilingJson, x, y, patt });
  console.log(res);
  return res;
};

/**
 * An endpoint for getting a row/col separation given a tiling.
 *
 * @param {TilingJson} tilingJson
 * @returns {RuleResponsePromise}
 */
const rowColSeparation = async (tilingJson) => {
  const res = await apiPost('/strategies/rowcolsep', tilingJson);
  console.log(res);
  return res;
};

export { getTiling, rowColPlacement, factor, cellInsertion, rowColSeparation };
