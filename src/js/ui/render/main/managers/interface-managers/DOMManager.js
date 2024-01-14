import { throwError, isHTMLElement } from '../ManagerUtilities';
export default function DOMManager() {
  let _mainGridSelector = null;
  let _trackingGridSelector = null;
  let _mainFleetListSelector = null;
  let _trackingFleetListSelector = null;
  let _currentPlayerDisplaySelector = null;
  let _boardContainerSelector = null;
  let _boardSelector = null;

  const getElement = (selector, element = document) => element.querySelector(selector);
  const getBoardContainer = () => getElement(_boardContainerSelector);
  const getBoard = () => getElement(_boardSelector, getBoardContainer());
  const getMainGrid = (board) => getElement(_mainGridSelector, board);
  const getTrackingGrid = (board) => getElement(_trackingGridSelector, board);
  const getMainFleetList = (board) => getElement(_mainFleetListSelector, board);
  const getTrackingFleetList = (board) => getElement(_trackingFleetListSelector, board);
  const getCurrentPlayerDisplay = () => getElement(_currentPlayerDisplaySelector);

  const getBoardGrids = (board) => {
    if (!isHTMLElement(board)) throwError('board', 'Element', board);
    return { main: getMainGrid(board), tracking: getTrackingGrid(board) };
  };
  const getBoardFleetLists = (board) => {
    if (!isHTMLElement(board)) throwError('board', 'Element', board);
    return { main: getMainFleetList(board), tracking: getTrackingFleetList(board) };
  };
  const validateSelectors = (selectors, element = document) => {
    if (!(isHTMLElement(element) || element === document)) throwError('element', 'Element', element);
    selectors.forEach((selector) => {
      if (!isHTMLElement(element.querySelector(selector))) {
        console.warn(`Warning Selector '${selector}' did not match any elements in`, element);
      }
    });
  };

  const updateCurrentPlayerDisplay = (playerName) => (getCurrentPlayerDisplay().textContent = `${playerName}'s Turn`);

  const updateCurrentBoardDisplay = (newBoard) => {
    const container = getBoardContainer();
    const currentBoard = getBoard();
    if (currentBoard && isHTMLElement(currentBoard)) currentBoard.remove();
    container.append(newBoard);
  };

  return {
    getBoardGrids,
    getBoardFleetLists,
    updateCurrentPlayerDisplay,
    updateCurrentBoardDisplay,
    initialize: ({
      mainGridSelector = '.main-grid',
      trackingGridSelector = '.tracking-grid',
      mainFleetListSelector = '.main-fleet-list',
      trackingFleetListSelector = '.tracking-fleet-list',
      currentPlayerDisplaySelector = '.current-player-display',
      boardContainerSelector = '.board-container',
      boardSelector = '.board'
    }) => {
      validateSelectors([
        mainGridSelector,
        trackingGridSelector,
        mainFleetListSelector,
        trackingFleetListSelector,
        currentPlayerDisplaySelector,
        boardContainerSelector,
        boardSelector
      ]);
      _mainGridSelector = mainGridSelector;
      _trackingGridSelector = trackingGridSelector;
      _mainFleetListSelector = mainFleetListSelector;
      _trackingFleetListSelector = trackingFleetListSelector;
      _currentPlayerDisplaySelector = currentPlayerDisplaySelector;
      _boardContainerSelector = boardContainerSelector;
      _boardSelector = boardSelector;
    },
    reset: () => {
      _mainGridSelector = null;
      _trackingGridSelector = null;
      _mainFleetListSelector = null;
      _trackingFleetListSelector = null;
      _currentPlayerDisplaySelector = null;
      _boardContainerSelector = null;
      _boardSelector = null;
    }
  };
}
