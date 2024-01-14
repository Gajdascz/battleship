import { isHTMLElement, throwError } from '../ManagerUtilities';

export default function BoardStateManager() {
  let _boardOptions = null;
  let _currentBoard = null;
  let _opponentBoard = null;

  return {
    get currentBoard() {
      return _currentBoard;
    },
    get boardOptions() {
      return _boardOptions;
    },
    updateCurrentBoardOnSwitch: () => {
      const tempBoard = _currentBoard;
      _currentBoard = _opponentBoard;
      _opponentBoard = tempBoard;
    },
    initialize: ({ currentBoard, opponentBoard, boardOptions }) => {
      if (!isHTMLElement(currentBoard)) throwError('currentBoard', 'HTMLElement', currentBoard);
      if (!isHTMLElement(opponentBoard)) throwError('opponentBoard', 'HTMLElement', opponentBoard);
      if (!(boardOptions instanceof Object)) throwError('boardOptions', 'Object', boardOptions);
      _currentBoard = currentBoard;
      _opponentBoard = opponentBoard;
      _boardOptions = boardOptions;
    },
    isInitialized: () => {
      return isHTMLElement(_currentBoard) && isHTMLElement(_opponentBoard) && _boardOptions instanceof Object;
    },
    reset: () => {
      _currentBoard = null;
      _opponentBoard = null;
      _boardOptions = null;
    }
  };
}
