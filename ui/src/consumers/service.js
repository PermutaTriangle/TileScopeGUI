import { apiPost } from './instance';

import '../utils/typedefs';

/**
 * An endpoint for fetching tiling from basis or json.
 *
 * @async
 * @param {string|TilingJson} basisOrJson
 * @returns {Promise.<{status: number, data: null|TilingResponse}>} promise with tiling
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
 * @returns {RuleResponsePromise} promise with rule
 */
const rowColPlacement = async (tilingJson, dir, row, idx) =>
  apiPost('/strategies/rowcolplace', { tiling: tilingJson, dir, row, idx });

/**
 * An endpoint for getting a factor rule given a tiling.
 *
 * @async
 * @param {TilingJson} tilingJson
 * @returns {RuleResponsePromise} promise with rule
 */
const factor = async (tilingJson) => apiPost('/strategies/factor', tilingJson);

/**
 * An endpoint for getting a cell insertion rule given a tiling.
 *
 * @async
 * @param {TilingJson} tilingJson
 * @param {number} x
 * @param {number} y
 * @param {string} patt
 * @returns {RuleResponsePromise} promise with rule
 */
const cellInsertion = async (tilingJson, x, y, patt) =>
  apiPost('/strategies/cellinsertion', { tiling: tilingJson, x, y, patt });

/**
 * An endpoint for getting a row/col separation given a tiling.
 *
 * @async
 * @param {TilingJson} tilingJson
 * @returns {RuleResponsePromise} promise with rule
 */
const rowColSeparation = async (tilingJson) => apiPost('/strategies/rowcolsep', tilingJson);

/**
 * An endpoint for obstuction inferral.
 *
 * @param {TilingJson} tilingJson
 * @returns {RuleResponsePromise} promise with rule
 */
const obstructionTransivity = async (tilingJson) => apiPost('/strategies/obstrans', tilingJson);

/**
 * An endpoint for placing requirements given a tiling.
 *
 * @async
 * @param {TilingJson} tilingJson
 * @param {number} x
 * @param {number} y
 * @param {number} idx
 * @param {number} dir
 * @returns {RuleResponsePromise} promise with rule
 */
const reqPlacement = async (tilingJson, x, y, idx, dir) =>
  apiPost('/strategies/reqplace', { tiling: tilingJson, x, y, idx, dir });

/**
 * An endpoint for adding assumptions given a tiling.
 *
 * @param {TilingJson} tilingJson
 * @param {number[][]} pos
 * @returns {RuleResponsePromise} promise with rule
 */
const addAssumption = async (tilingJson, pos) =>
  apiPost('/strategies/addassumption', { tiling: tilingJson, pos });

/**
 * An endpoint for fusing given a tiling.
 *
 * @param {TilingJson} tilingJson
 * @param {number} idx
 * @param {boolean} row
 * @returns {RuleResponsePromise} promise with rule
 */
const fusion = async (tilingJson, idx, row) =>
  apiPost('/strategies/fusion', { tiling: tilingJson, idx, row });

/**
 * An endpoint for sliding given a tiling.
 *
 * @param {TilingJson} tilingJson
 * @param {number} idx1
 * @param {number} idx2
 * @returns {RuleResponsePromise} promise with rule
 */
const sliding = async (tilingJson, idx1, idx2) =>
  apiPost('/strategies/sliding', { tiling: tilingJson, idx1, idx2 });

/**
 * An endpoint for symmetry given a tiling.
 *
 * @param {TilingJson} tilingJson
 * @param {number} symType
 * @returns {RuleResponsePromise} promise with rule
 */
const symmetries = async (tilingJson, symType) =>
  apiPost('/strategies/symmetry', { tiling: tilingJson, symmetry: symType });

/**
 * An endpoint for rearrange assumption given a tiling.
 *
 * @param {TilingJson} tilingJson
 * @returns {RuleResponsePromise} promise with rule
 */
const rearrangeAssumption = async (tilingJson) =>
  apiPost('/strategies/rearrangeassumption', tilingJson);

export {
  getTiling,
  rowColPlacement,
  factor,
  cellInsertion,
  rowColSeparation,
  reqPlacement,
  addAssumption,
  fusion,
  obstructionTransivity,
  sliding,
  symmetries,
  rearrangeAssumption,
};
