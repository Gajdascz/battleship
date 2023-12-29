import coordinateTranslator from './coordinateTranslator';

export default function board({ rows = 10, cols = 10, letterAxis = 'row' } = {}) {
  const createGrid = (rows, cols) => Array.from({ length: rows }).map(() => Array.from({ length: cols }).fill(null));

  const _mainGrid = createGrid(rows, cols);
  const _trackingGrid = createGrid(rows, cols);
  const _ships = [];

  const translator = coordinateTranslator(letterAxis);

  const isHorizontal = (start, end) => start.row === end.row;
  const isInBounds = (start, end) => {
    return (
      start.row < _mainGrid.length &&
      end.row < _mainGrid.length &&
      start.col < _mainGrid[0].length &&
      end.col < _mainGrid[0].length
    );
  };

  const isPlacementValid = (start, end, isHorizontal) => {
    if (!isInBounds(start, end)) return false;
    if (isHorizontal) {
      for (let i = start.col; i <= end.col; i++) {
        if (_mainGrid[start.row][i] !== null) return false;
      }
    } else {
      for (let i = start.row; i <= end.row; i++) {
        if (_mainGrid[i][start.col] !== null) return false;
      }
    }
    return true;
  };

  const place = ({ ship, start, end }) => {
    const _start = translator(start);
    const _end = translator(end);
    const _ref = ship.name.charAt(0);
    if (isPlacementValid(_start, _end)) {
      if (isHorizontal(_start, _end)) {
        for (let i = _start.col; i <= _end.col; i++) _mainGrid[_start.row][i] = _ref;
      } else {
        for (let i = _start.row; i <= _end.row; i++) _mainGrid[i][_start.col] = _ref;
      }
    } else return false;

    _ships.push(ship);
    return true;
  };

  return { place };
}
