/**
 * Creates a utility function to translate alphanumeric coordinates into an object with numerical row and column properties.
 * The translation is based on whether a letter represents a row or a column.
 *
 * @param {string} letterAxis - Specifies the axis ('row' or 'col') that the letter in the coordinates represents.
 * @returns {function} - A function that takes an array of coordinates (in the format of [letter, number] or [number, letter])
 *                       and returns an object with numerical 'row' and 'col' properties.
 *                       The letter in the coordinates is translated to a zero-based row or column index (e.g., 'A' -> 0, 'B' -> 1).
 */
export default function coordinateTranslator(letterAxis) {
  if (letterAxis === 'row') {
    return (coordinates) => ({ row: coordinates[0].charCodeAt() - 'A'.charCodeAt(), col: +coordinates[1] });
  } else {
    return (coordinates) => ({ row: +coordinates[0], col: coordinates[1].charCodeAt() - 'A'.charCodeAt() });
  }
}
