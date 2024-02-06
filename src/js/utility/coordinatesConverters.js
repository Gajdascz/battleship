/**
 * @module coordinatesConverters
 * Utility functions to centralize and streamline coordinate pair conversion between display formats
 * and internal numeric representations. Supports flexible display formatting, allowing either axis
 * to be labeled with letters (e.g., column or row).
 *
 * Examples of conversions:
 *  - 'A0' => [0, 0] (Letter labels column)
 *  - '0A' => [0, 0] (Letter labels row)
 *  - [5, 2] => 'C5' or '5C' depending on axis labeled with letters
 */

/**
 * Converts a string representation of display-formatted coordinates to an array of integers for internal use.
 * The function is flexible to input format, supporting letter-first (e.g., "A1") or number-first (e.g., "1A") conventions.
 *
 * @param {string} coordinate String representation of coordinates. Eg: "E5", "A2", "2B", etc.
 * @returns {number[]} Coordinate pair as numbers [row, column] for internal processing.
 * @throws {Error} If the coordinate format is invalid or cannot be parsed.
 * @example
 * // Returns [4, 5] for letter labeling columns
 * convertToInternalFormat("E5");
 * @example
 * // Returns [1, 0] for letter labeling rows
 * convertToInternalFormat("1A");
 */
const convertToInternalFormat = (coordinate) => {
  const letterMatch = coordinate.match(/([A-Za-z]+)/)[0];
  const numberMatch = coordinate.match(/\d+/)[0];
  if (!letterMatch || !numberMatch) throw new Error('Invalid coordinate format.');
  const ACHARCODE = 'A'.charCodeAt();
  const row = isNaN(coordinate[0])
    ? letterMatch.toUpperCase().charCodeAt(0) - ACHARCODE
    : +numberMatch;
  const col = isNaN(coordinate[0])
    ? +numberMatch
    : letterMatch.toUpperCase().charCodeAt(0) - ACHARCODE;
  return [row, col];
};

/**
 * Converts internally formatted coordinates [row, column] to their corresponding display format,
 * accommodating flexible labeling of either axis with letters.
 *
 * @param {number} row Number representation of the row index.
 * @param {number} col Number representation of the column index.
 * @param {boolean} isLetterRow Flag indicating whether the row (true) or column (false) is labeled with a letter in the output.
 * @returns {string} String representation of coordinates, formatted based on the specified axis labeling.
 * @example
 * // Returns "A0" when the column is labeled with letters
 * convertToDisplayFormat(0, 0, false);
 * @example
 * // Returns "0A" when the row is labeled with letters
 * convertToDisplayFormat(0, 0, true);
 */
const convertToDisplayFormat = (row, col, isLetterRow = true) => {
  const ACHARCODE = 'A'.charCodeAt();
  const letterPart = String.fromCharCode(ACHARCODE + (isLetterRow ? row : col));
  const numberPart = isLetterRow ? col : row;
  return isLetterRow ? `${letterPart}${numberPart}` : `${numberPart}${letterPart}`;
};

export { convertToInternalFormat, convertToDisplayFormat };
