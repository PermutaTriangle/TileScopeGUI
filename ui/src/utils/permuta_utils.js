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

export { directionNumberToString, directionStringToNumber, allSymmetries };
