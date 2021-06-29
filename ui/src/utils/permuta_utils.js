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

export { directionNumberToString, directionStringToNumber };
