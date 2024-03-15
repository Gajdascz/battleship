const popRandom = (array) => array?.splice(Math.floor(Math.random() * array.length), 1)[0] ?? null;
const popFrom = (array, index) => array?.splice(index, 1) ?? null;
const getFrom = (array, index) => array?.slice(index, 1) ?? null;
const popFirst = (array) => array.splice(0, 1)[0];

const getRandom = (array) => array[Math.floor(Math.random() * array.length)].slice() ?? null;
const areCoordinatesEqual = (c1, c2) => c1[0] === c2[0] && c1[1] === c2[1];

const removeDuplicates = (array) => {
  if (!Array.isArray(array) || !Array.isArray(array[0])) return null;
  if (array.length <= 1) return array;
  const cleanArray = [];
  array.forEach((coordinates) => {
    if (
      !cleanArray.some((cleanCoordinates) => areCoordinatesEqual(cleanCoordinates, coordinates))
    ) {
      cleanArray.push(coordinates);
    }
  });
  return cleanArray;
};

export { popRandom, popFrom, areCoordinatesEqual, removeDuplicates, getRandom, getFrom, popFirst };