export default function SessionStorage() {
  const storePlayerOne = (playerOneObj) => sessionStorage.setItem('playerOne', serializeData(playerOneObj));
  const storePlayerTwo = (playerTwoObj) => sessionStorage.setItem('playerTwo', serializeData(playerTwoObj));
  const storeBoardOptions = (boardOptionsObj) => sessionStorage.setItem('boardOptions', serializeData(boardOptionsObj));

  const getPlayerOneDataObj = () => deserializeData(sessionStorage.getItem('playerOne'));
  const getPlayerTwoDataObj = () => deserializeData(sessionStorage.getItem('playerTwo'));
  const getBoardOptionsObj = () => deserializeData(sessionStorage.getItem('boardOptions'));

  const serializeData = (dataObj) => JSON.stringify(dataObj);
  const deserializeData = (serializedData) => JSON.parse(serializedData);

  const hasStorage = () => {
    return getPlayerOneDataObj() && getPlayerTwoDataObj() && getBoardOptionsObj();
  };

  return {
    storePlayerOne,
    storePlayerTwo,
    storeBoardOptions,
    getPlayerOneDataObj,
    getPlayerTwoDataObj,
    getBoardOptionsObj,
    hasStorage,
    clear: () => sessionStorage.clear()
  };
}
