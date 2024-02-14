import { isHTMLElement, throwError } from '../managerUtilities';

export default function PlayerStateManager() {
  const _p1 = {};
  const _p2 = {};
  const _current = { player: null, opponent: null };
  return {
    get currentPlayer() {
      return _current.player;
    },
    get opponentPlayer() {
      return _current.opponent;
    },
    get currentPlayerBoard() {
      return _current.player.boardController.element;
    },
    get opponentPlayerBoard() {
      return _current.opponent.boardController.element;
    },
    get currentPlayerBoardController() {
      return _current.player.boardController;
    },
    get currentPlayerFleetManager() {
      return _current.player.fleetManager;
    },
    get p1Board() {
      return _p1.boardController.element;
    },
    get p2Board() {
      return _p2.boardController.element;
    },
    get p1BoardController() {
      return _p1.boardController;
    },
    get p2BoardController() {
      return _p2.boardController;
    },
    get p1FleetManager() {
      return _p1.fleetManager;
    },
    get p2FleetManager() {
      return _p2.fleetManager;
    },
    switchCurrentPlayer: () =>
      ([_current.player, _current.opponent] = [_current.opponent, _current.player]),
    initialize: ({ currentPlayer, opponentPlayer }) => {
      if (!currentPlayer || !currentPlayer.isPlayer)
        throwError('currentPlayer', 'Player Object', currentPlayer);
      if (!opponentPlayer || !opponentPlayer.isPlayer)
        throwError('opponentPlayer', 'Player Object', opponentPlayer);
      _current.player = currentPlayer;
      _current.opponent = opponentPlayer;
    },
    isInitialized: () =>
      _current.player.isPlayer &&
      _current.opponent.isPlayer &&
      isHTMLElement(_p1.boardController.element) &&
      isHTMLElement(_p2.boardController.element) &&
      (_p1.id === _current.player.id || _p1.id === _current.opponent.id) &&
      (_p2.id === _current.player.id || _p2.id === _current.opponent.id),
    reset: () => {
      _current.player = null;
      _current.opponent = null;
    }
  };
}
