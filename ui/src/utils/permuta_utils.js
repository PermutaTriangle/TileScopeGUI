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
