module.exports = function solveSudoku(matrix) {
  const SIZE = 9;
  const ALL_NUMS = new Array(SIZE).fill(0).map((_, i) => i + 1);

  const getPossibileValues = (row, col, m, values) => {
    let isInitial = true;
    if (values) {
      isInitial = false;
    } else {
      values = new Set(ALL_NUMS);
    }

    // filter in row
    m[row].forEach((v) => values.delete(v));

    // filter in column
    m.forEach((r) => values.delete(r[col]));

    // filter in square
    const [fromRow, fromCol] = [Math.floor(row / 3) * 3, Math.floor(col / 3) * 3];
    const squareCoords = [
      [fromRow, fromCol], [fromRow, fromCol + 1], [fromRow, fromCol + 2],
      [fromRow + 1, fromCol], [fromRow + 1, fromCol + 1], [fromRow + 1, fromCol + 2],
      [fromRow + 2, fromCol], [fromRow + 2, fromCol + 1], [fromRow + 2, fromCol + 2],
    ];
    squareCoords.forEach(([i, j]) => values.delete(m[i][j]));

    // check if there are values that can be only here
    if (values.size === 0) {
      throw new Error('No possible values');

    } else if (!isInitial && values.size > 1) {
      for (const value of values) {

        // if only 1 possible value left - set it
        if (m[row].filter((vSet) => typeof vSet === 'object' && vSet.has(value)).length === 1
          || m.filter((r) => typeof r[col] === 'object' && r[col].has(value)).length === 1
          || squareCoords.filter(([i, j]) => typeof m[i][j] === 'object' && m[i][j].has(value)).length === 1
        ) {
          values.clear();
          values.add(value);
          break;
        }
      }
    }

    return values.size === 1 ? values.values().next().value : values;
  };

  const preprocessMatrix = (m) => {
    const result = new Array(SIZE).fill(0).map(() => new Array(SIZE));

    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        result[i][j] = m[i][j] === 0 ? getPossibileValues(i, j, m) : m[i][j];
      }
    }

    return result;
  }

  let result = preprocessMatrix(matrix);

  const processMatrix = (m) => {
    let isChanged = false;
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (Number.isFinite(m[i][j])) {
          continue;
        }

        const possibleValues = getPossibileValues(i, j, m, m[i][j]);

        if (typeof possibleValues !== 'object' || possibleValues.size !== m[i][j].size) {
          isChanged = true;
          m[i][j] = possibleValues;
        }
      }
    }
    return isChanged;
  };

  while (processMatrix(result)) {
    // empty block
  }

  const copyMatrixWithSets = (m) => {
    const copy = new Array(SIZE).fill(0).map(() => new Array(SIZE));
    m.forEach((r, i) => r.forEach((v, j) => copy[i][j] = (typeof v === 'object') ? new Set(v) : v));
    return copy;
  };

  // if not solved - find smallest possible variants by quantity
  // and try putting their numbers 1 by 1
  if (result.filter((r) => r.filter((v) => typeof v === 'object').length > 0).length > 0) {

    let min = 9;
    let minRow, minCol;

    outer:
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {

        const values = result[i][j];
        if (typeof values !== 'object') {
          continue;
        }

        if (values.size < min) {
          min = values.size;
          [minRow, minCol] = [i, j];

          if (values.size === 2) {
            break outer;
          }
        } 
      }
    }

    // try putting possible values numbers 1 by 1
    for (const value of result[minRow][minCol]) {
      const copy = copyMatrixWithSets(result);
      copy[minRow][minCol] = value;
      try {
        result = solveSudoku(copy);
        break;
      } catch(error) {
        // left empty be intention - the value did not match
        continue;
      }
    }
  }

  return result;
}
