import renderPlacementState from '../placement-state/renderPlacementState';
import renderInProgressState from '../progress-state/renderInProgressState';
import renderGameOverState from '../over-state/renderGameOverState';

export default function renderStateManager() {
  let _boardContainer = null;
  let _currentBoard = null;
  let _currentPlayerDisplay = null;
  let _p1Board = null;
  let _p2Board = null;
  let _currentStateComponents = null;
  let _currentPlayer = null;
  let _currentState = null;
  const _stateTransitionListeners = new Map();

  document.addEventListener('playerSwitched', (e) => {
    _currentPlayer = e.detail.currentPlayer;
  });

  const setCurrentPlayerBoard = (board) => {
    if (_currentBoard) _currentBoard.remove();
    _currentBoard = board;
    _boardContainer.append(_currentBoard);
  };
  const syncCurrentPlayer = () => {
    setCurrentPlayerBoard(getCurrentPlayerBoard());
    updateCurrentPlayerDisplay();
  };
  const updateCurrentPlayerDisplay = () => (_currentPlayerDisplay.textContent = `${_currentPlayer.name}'s Turn`);

  const getCurrentPlayerFleetList = () => _currentBoard.querySelector('.fleet-container > .fleet-ship-list-container');
  const getCurrentPlayerTrackingGrid = () => _currentBoard.querySelector('.tracking-grid');
  const getCurrentPlayerTrackingFleetList = () => {
    return _currentBoard.querySelector('.opponent-fleet-container > .fleet-ship-list-container');
  };
  const getCurrentPlayerBoard = () => (_currentPlayer.id === 'playerOne' ? _p1Board : _p2Board);
  const getCurrentPLayerMainGrid = () => getCurrentPlayerBoard().querySelector(`.main-grid`);

  const getOpponentPlayerBoard = () => (_currentPlayer.id === 'playerOne' ? _p2Board : _p1Board);
  const getOpponentPlayerMainGrid = () => getOpponentPlayerBoard().querySelector('.main-grid');

  const addStateTransitionListeners = ({ state, events }) => {
    events.forEach((callbacks, event) => callbacks.forEach((callback) => document.addEventListener(event, callback)));
    _currentState = state;
    _stateTransitionListeners.set(state, events);
  };
  const removeStateTransitionListeners = (state) => {
    _stateTransitionListeners
      .get(state)
      .forEach((callbacks, event) => callbacks.forEach((callback) => document.removeEventListener(event, callback)));
    _stateTransitionListeners.delete(state);
  };
  const clearAllStateTransitionListeners = () => {
    _stateTransitionListeners.forEach((callbacks, event) => {
      callbacks.forEach((callback) => document.removeEventListener(event, callback));
    });
    _stateTransitionListeners.clear();
  };
  function clearState() {
    _currentStateComponents?.clearState();
    _currentStateComponents = null;
  }
  const placementState = (callback) => {
    if (_currentStateComponents) clearState();
    _currentStateComponents = renderPlacementState(_currentBoard, getCurrentPlayerFleetList(), callback);
  };
  const inProgressState = (callback) => {
    if (_currentStateComponents) clearState();
    _currentStateComponents = renderInProgressState(_p1Board, _p2Board, callback);
  };
  const gameOverState = (callback) => {
    if (_currentStateComponents) clearState();
    _currentStateComponents = renderGameOverState();
  };
  return {
    get boardContainer() {
      return _boardContainer;
    },
    set boardContainer(newContainer) {
      _boardContainer = newContainer;
    },
    get currentBoard() {
      return _currentBoard;
    },
    set currentBoard(newBoard) {
      setCurrentPlayerBoard(newBoard);
    },
    get currentPlayerDisplay() {
      return _currentPlayerDisplay;
    },
    set currentPlayerDisplay(newDisplay) {
      _currentPlayerDisplay = newDisplay;
    },
    get p1Board() {
      return _p1Board;
    },
    set p1Board(board) {
      _p1Board = board;
    },
    get p2Board() {
      return _p2Board;
    },
    set p2Board(board) {
      _p2Board = board;
    },
    get currentPlayer() {
      return _currentPlayer;
    },
    set currentPlayer(player) {
      _currentPlayer = player;
      updateCurrentPlayerDisplay();
    },
    get currentPlayerBoard() {
      return getCurrentPlayerBoard();
    },
    get currentPlayerMainGrid() {
      return getCurrentPLayerMainGrid();
    },
    get currentPlayerFleetList() {
      return getCurrentPlayerFleetList();
    },
    get currentPlayerTrackingGrid() {
      return getCurrentPlayerTrackingGrid();
    },
    get currentPlayerTrackingFleetList() {
      return getCurrentPlayerTrackingFleetList();
    },
    get opponentPlayerBoard() {
      return getOpponentPlayerBoard();
    },
    get opponentPlayerMainGrid() {
      return getOpponentPlayerMainGrid();
    },
    get currentStateComponents() {
      return _currentStateComponents;
    },
    get stateTransitionListener() {
      return _stateTransitionListeners;
    },
    get currentState() {
      return _currentState;
    },
    syncCurrentPlayer,
    addStateTransitionListeners,
    removeStateTransitionListeners,
    placementState,
    inProgressState,
    gameOverState,
    reset: function () {
      _boardContainer = null;
      _currentBoard = null;
      _currentPlayerDisplay = null;
      _p1Board.textContent = '';
      _p1Board = null;
      _p2Board = null;
      _currentPlayer = null;
      _currentState = null;
      clearAllStateTransitionListeners();
      clearState();
    }
  };
}
