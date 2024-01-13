import PlayerManager from './managers/PlayerManager';
import BoardManager from './managers/BoardManager';
import StateTransitionEventManager from './managers/StateTransitionEventManager';
import StateManager from './managers/StateManager';
import DOMManager from './managers/DOMManager';

export default function RenderController() {
  const _playerManager = PlayerManager();
  const _boardManager = BoardManager();
  const _StateTransitionEventManager = StateTransitionEventManager();
  const _stateManager = StateManager();
  const _DOMManager = DOMManager();

  const tryCatch = (fn, { parameters }) => {
    try {
      fn(...parameters);
    } catch (error) {
      console.error(`Error in function call ${fn.name}`, error);
    }
  };

  const onPlayerSwitched = (event) => {};

  return {
    // Manager Initializers
    initializePlayerManager: (playerInfo) => tryCatch(_playerManager.initialize, { parameters: [playerInfo] }),
    initializeBoardManager: (boardInfo) => tryCatch(_boardManager.initialize, { parameters: [boardInfo] }),
    initializeDOMManager: (domInfo) => tryCatch(_DOMManager.initialize, { parameters: domInfo }),

    // PlayerManager
    getCurrentPlayer: () => _playerManager.currentPlayer,
    getCurrentPlayerBoard: () => _playerManager.currentPlayerBoard,
    getOpponentPlayerBoard: () => _playerManager.opponentPlayerBoard,
    displayCurrentPlayerName: () => _playerManager.updateCurrentPlayerDisplay(),

    // BoardManager
    getCurrentBoard: () => _boardManager.currentBoard,
    getBoardOptions: () => _boardManager.boardOptions,
    getCurrentBoardGrids: () => _boardManager.currentBoardGrids,
    getOpponentPlayerGrids: () => _boardManager.opponentBoardGrids,
    getCurrentBoardFleetList: () => _boardManager.currentBoardFleetLists,
    getOpponentBoardFleetList: () => _boardManager.opponentBoardFleetLists,

    // EventManager
    addStateTransitionListeners: ({ state, event }) => {
      tryCatch(_StateTransitionEventManager.addStateTransitionListeners, { parameters: [state, event] });
    },
    removeStateTransitionListeners: (state) => {
      tryCatch(_StateTransitionEventManager.removeStateTransitionListeners, { parameters: [state] });
    },

    // StateManager
    startPlacementState: ({ currentBoard, currentPlayerFleetList, callback }) => {
      tryCatch(_stateManager.placementState, { parameters: [currentBoard, currentPlayerFleetList, callback] });
    },
    startInProgressState: ({ p1Board, p2Board, callback }) => {
      tryCatch(_stateManager.inProgressState, { parameters: [p1Board, p2Board, callback] });
    },
    startGameOverState: ({ winner, callback }) => {
      tryCatch(_stateManager.gameOverState, { parameters: [winner, callback] });
    },

    reset: () => {
      _playerManager.reset();
      _boardManager.reset();
      _StateTransitionEventManager.clearAllStateTransitionListeners();
      _stateManager.reset();
      _DOMManager.reset();
    }
  };
}
