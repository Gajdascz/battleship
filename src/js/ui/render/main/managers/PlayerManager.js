import { isHTMLElement, throwError } from './ManagerUtilities';

export default function PlayerManager() {
  let _currentPlayer = null;
  let _opponentPlayer = null;
  let _p1Board = null;
  let _p2Board = null;
  let _p1ID = null;
  let _p2ID = null;
  return {
    get currentPlayer() {
      return _currentPlayer;
    },
    get currentPlayerBoard() {
      return _currentPlayer?.id === _p1ID ? _p1Board : _p2Board;
    },
    get opponentPlayerBoard() {
      return _currentPlayer?.id === _p2ID ? _p2Board : _p1Board;
    },
    updateCurrentPlayerOnSwitch: () => {
      const tempPlayer = _currentPlayer;
      _currentPlayer = _opponentPlayer;
      _opponentPlayer = tempPlayer;
    },
    initialize: ({ currentPlayer, opponentPlayer, p1Board, p2Board, p1ID, p2ID }) => {
      if (!currentPlayer || !currentPlayer.isPlayer) throwError('currentPlayer', 'Player Object', currentPlayer);
      if (!opponentPlayer || !opponentPlayer.isPlayer) throwError('opponentPlayer', 'Player Object', opponentPlayer);
      if (!isHTMLElement(p1Board.isBoard)) throwError('p1Board', 'Element', p1Board);
      if (!isHTMLElement(p2Board.isBoard)) throwError('p2Board', 'Element', p2Board);
      if (!(typeof p1ID === 'string')) throwError('p1ID', 'string', p1ID);
      if (!(typeof p2ID === 'string')) throwError('p2ID', 'string', p2ID);
      _currentPlayer = currentPlayer;
      _opponentPlayer = opponentPlayer;
      _p1Board = p1Board;
      _p2Board = p2Board;
      _p1ID = p1ID;
      _p2ID = p2ID;
    },
    reset: () => {
      _currentPlayer = null;
      _p1Board = null;
      _p2Board = null;
      _p1ID = null;
      _p2ID = null;
    }
  };
}
