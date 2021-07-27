import { apiPost } from './instance';
import { stateToVerifyTactics } from '../utils/permuta_utils';
import '../utils/typedefs';

/**
 * An endpoint for fetching tiling from basis or json.
 *
 * @async
 * @param {string|TilingJson} basisOrJson
 * @param {AppStateInterface} state
 * @returns {Promise.<{status: number, data: null|TilingResponse}>} promise with tiling
 */
const getTiling = async (basisOrJson, state) =>
  apiPost('/tiling/init', { tiling: basisOrJson, verify: stateToVerifyTactics(state) });

/**
 * Convert an array of tiling keys to tiling jsons.
 *
 * @async
 * @param {string[]} tilingKeys
 * @returns {Promise.<{status: number, data: TilingJson[]|null}>}
 */
const decodeTilings = async (tilingKeys) => apiPost('/tiling/decode', tilingKeys);

/**
 * Convert key to a repl of tiling.
 *
 * @param {string} tilingKey
 * @returns {Promise.<{status: number, data: string|null}>}
 */
const replOfTiling = async (tilingKey) => apiPost('/tiling/repl', tilingKey);

/**
 * An endpoint for getting row/col placement rule given a tiling.
 *
 * @async
 * @param {string} tilingKey
 * @param {AppStateInterface} state
 * @param {0|1|2|3} dir
 * @param {boolean} row
 * @param {int} idx
 * @returns {RuleResponsePromise} promise with rule
 */
const rowColPlacement = async (tilingKey, state, dir, row, idx) =>
  apiPost('/strategies/rowcolplace', {
    tiling: tilingKey,
    verify: stateToVerifyTactics(state),
    dir,
    row,
    idx,
  });

/**
 * An endpoint for getting a factor rule given a tiling.
 *
 * @async
 * @param {string} tilingKey
 * @param {AppStateInterface} state
 * @param {boolean} interleaving
 * @returns {RuleResponsePromise} promise with rule
 */
const factor = async (tilingKey, state, interleaving = false) =>
  apiPost(`/strategies/factor${interleaving ? '?interleaving=all' : ''}`, {
    tiling: tilingKey,
    verify: stateToVerifyTactics(state),
  });

/**
 * An endpoint for getting a cell insertion rule given a tiling.
 *
 * @async
 * @param {string} tilingKey
 * @param {AppStateInterface} state
 * @param {number} x
 * @param {number} y
 * @param {string} patt
 * @returns {RuleResponsePromise} promise with rule
 */
const cellInsertion = async (tilingKey, state, x, y, patt) =>
  apiPost('/strategies/cellinsertion', {
    tiling: tilingKey,
    verify: stateToVerifyTactics(state),
    x,
    y,
    patt,
  });

/**
 * An endpoint for getting a row/col separation given a tiling.
 *
 * @async
 * @param {string} tilingKey
 * @param {AppStateInterface} state
 * @returns {RuleResponsePromise} promise with rule
 */
const rowColSeparation = async (tilingKey, state) =>
  apiPost('/strategies/rowcolsep', {
    tiling: tilingKey,
    verify: stateToVerifyTactics(state),
  });

/**
 * An endpoint for obstuction inferral.
 *
 * @async
 * @param {string} tilingKey
 * @param {AppStateInterface} state
 * @returns {RuleResponsePromise} promise with rule
 */
const obstructionTransivity = async (tilingKey, state) =>
  apiPost('/strategies/obstrans', {
    tiling: tilingKey,
    verify: stateToVerifyTactics(state),
  });

/**
 * An endpoint for placing requirements given a tiling.
 *
 * @async
 * @param {string} tilingKey
 * @param {AppStateInterface} state
 * @param {number} x
 * @param {number} y
 * @param {number} idx
 * @param {number} dir
 * @returns {RuleResponsePromise} promise with rule
 */
const reqPlacement = async (tilingKey, state, x, y, idx, dir) =>
  apiPost('/strategies/reqplace', {
    tiling: tilingKey,
    verify: stateToVerifyTactics(state),
    x,
    y,
    idx,
    dir,
  });

/**
 * An endpoint for adding assumptions given a tiling.
 *
 * @async
 * @param {string} tilingKey
 * @param {AppStateInterface} state
 * @param {number[][]} pos
 * @returns {RuleResponsePromise} promise with rule
 */
const addAssumption = async (tilingKey, state, pos) =>
  apiPost('/strategies/addassumption', {
    tiling: tilingKey,
    verify: stateToVerifyTactics(state),
    pos,
  });

/**
 * An endpoint for fusing given a tiling.
 *
 * @async
 * @param {string} tilingKey
 * @param {AppStateInterface} state
 * @param {number} idx
 * @param {boolean} row
 * @returns {RuleResponsePromise} promise with rule
 */
const fusion = async (tilingKey, state, idx, row) =>
  apiPost('/strategies/fusion', {
    tiling: tilingKey,
    verify: stateToVerifyTactics(state),
    idx,
    row,
  });

/**
 * An endpoint for sliding given a tiling.
 *
 * @async
 * @param {string} tilingKey
 * @param {AppStateInterface} state
 * @param {number} idx1
 * @param {number} idx2
 * @returns {RuleResponsePromise} promise with rule
 */
const sliding = async (tilingKey, state, idx1, idx2) =>
  apiPost('/strategies/sliding', {
    tiling: tilingKey,
    verify: stateToVerifyTactics(state),
    idx1,
    idx2,
  });

/**
 * An endpoint for symmetry given a tiling.
 *
 * @async
 * @param {string} tilingKey
 * @param {AppStateInterface} state
 * @param {number} symType
 * @returns {RuleResponsePromise} promise with rule
 */
const symmetries = async (tilingKey, state, symType) =>
  apiPost('/strategies/symmetry', {
    tiling: tilingKey,
    verify: stateToVerifyTactics(state),
    symmetry: symType,
  });

/**
 * An endpoint for rearrange assumption given a tiling.
 *
 * @async
 * @param {string} tilingKey
 * @param {AppStateInterface} state
 * @returns {RuleResponsePromise} promise with rule
 */
const rearrangeAssumption = async (tilingKey, state) =>
  apiPost('/strategies/rearrangeassumption', {
    tiling: tilingKey,
    verify: stateToVerifyTactics(state),
  });

export {
  getTiling,
  decodeTilings,
  replOfTiling,
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
