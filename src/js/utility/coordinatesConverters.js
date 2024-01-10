const convertToInternalFormat = (coordinate) => {
  const letterMatch = coordinate.match(/([A-Za-z]+)/)[0];
  const numberMatch = coordinate.match(/\d+/)[0];
  const ACHARCODE = 'A'.charCodeAt();
  if (!letterMatch || !numberMatch) throw new Error('Invalid coordinate format.');
  const row = isNaN(coordinate[0]) ? letterMatch.toUpperCase().charCodeAt(0) - ACHARCODE : +numberMatch;
  const col = isNaN(coordinate[0]) ? +numberMatch : letterMatch.toUpperCase().charCodeAt(0) - ACHARCODE;
  return [row, col];
};

const convertToDisplayFormat = (row, col, isLetterRow = true) => {
  const ACHARCODE = 'A'.charCodeAt();
  const letterPart = String.fromCharCode(ACHARCODE + (isLetterRow ? row : col));
  const numberPart = isLetterRow ? col : row;
  return isLetterRow ? `${letterPart}${numberPart}` : `${numberPart}${letterPart}`;
};

export { convertToInternalFormat, convertToDisplayFormat };
