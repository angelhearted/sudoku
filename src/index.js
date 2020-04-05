module.exports = function solveSudoku(matrix) {
  const SIZE = 9;
  const ALL_NUMS = new Array(SIZE).fill(0).map((_, i) => i + 1);

  const getPossibileValues = (row, col, m) => {
    const values = new Set(ALL_NUMS);

    // filter in row
    m[row].forEach((v) => values.delete(v));
    if (values.size === 1) {
      return values.values().next().value;
    }

    // filter in column
    m.forEach((r) => values.delete(r[col]));
    if (values.size === 1) {
      return values.values().next().value;
    }

    // filter in square
    const [fromRow, fromCol] = [Math.floor(row / 3) * 3, Math.floor(col / 3) * 3];
    for (let i = fromRow; i < fromRow + 3; i++) {
      m[i].slice(fromCol, fromCol + 3).forEach((v) => values.delete(v));
    }

    return values.size === 1 ? values.values().next().value : [...values];
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

  const result = preprocessMatrix(matrix);

  return result;
}
