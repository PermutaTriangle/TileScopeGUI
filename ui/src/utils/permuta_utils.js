import './typedefs';

/**
 * Convert lower case directional letter to number.
 *
 * @param {'e'|'n'|'w'|'s'} dir
 * @returns {0|1|2|3} The number corresponding to letter.
 */
const directionStringToNumber = (dir) => {
  switch (dir) {
    case 'e':
      return 0;
    case 'n':
      return 1;
    case 'w':
      return 2;
    default:
      return 3;
  }
};

/**
 * Convert number to lower case directional letter.
 *
 * @param {0|1|2|3} dir
 * @returns {'e'|'n'|'w'|'s'} The letter corresponding to the number.
 */
const directionNumberToString = (dir) => {
  switch (dir) {
    case 0:
      return 'e';
    case 1:
      return 'n';
    case 2:
      return 'w';
    default:
      return 's';
  }
};

/**
 * Get all symmetry names and their ids.
 *
 * @returns {Array.<Array<string|number>>} Names and id
 */
const allSymmetries = () => [
  ['Rotate 90', 1],
  ['Rotate 180', 2],
  ['Rotate 270', 3],
  ['Vertical flip', 4],
  ['Horizontal flip', 5],
  ['Diagonal flip', 6],
  ['Antidiagonal flip', 7],
];

/**
 * Check if op is equiv op.
 *
 * @param {str} op
 * @returns true if equiv
 */
const isEquivOp = (op) => op === '≅';

/**
 *
 * @param {AppStateInterface} appState
 * @returns {VerifyTactics} verification tactics
 */
const stateToVerifyTactics = (appState) => {
  const strats = [];
  if (appState.getInsertionEncodableVerification()) strats.push(0);
  if (appState.getLocallyFactorableVerification()) strats.push(1);
  if (appState.getShortObstructionVerification()) strats.push(2);
  if (appState.getOneByOneVerifciation()) strats.push(3);
  if (appState.getSubclassVerification()) strats.push(4);
  return {
    basis: appState.getRootBasis(),
    strats,
  };
};

export {
  directionNumberToString,
  directionStringToNumber,
  allSymmetries,
  isEquivOp,
  stateToVerifyTactics,
};
