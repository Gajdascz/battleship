export default function coordinateTranslator(letterAxis) {
  if (letterAxis === 'row') {
    return (coordinates) => ({ row: coordinates[0].charCodeAt() - 'A'.charCodeAt(), col: coordinates[1] });
  } else {
    return (coordinates) => ({ row: coordinates[0], col: coordinates[1].charCodeAt() - 'A'.charCodeAt() });
  }
}
