import renderPlacementState from '../../placement-state/renderPlacementState';
import renderInProgressState from '../../progress-state/renderInProgressState';
import renderGameOverState from '../../over-state/renderGameOverState';
import { isHTMLElement, throwError } from './ManagerUtilities';
export default function StateManager() {
  let _currentState = null;
  let _currentStateController = null;

  function changeState(newState, ...args) {
    _currentStateController?.clearState();
    _currentState = newState;
    _currentStateController = newState(...args);
  }

  return {
    get currentState() {
      return _currentState;
    },
    placementState: (currentBoard, currentPlayerFleetList, callback) => {
      if (!isHTMLElement(currentBoard)) throwError('currentBoard', 'Element', currentBoard);
      if (!isHTMLElement(currentPlayerFleetList)) {
        throwError('currentPlayerFleetList', 'Element', currentPlayerFleetList);
      }
      if (!(callback instanceof Function)) throwError('placementState callback', 'Function', callback);
      changeState(renderPlacementState, currentBoard, currentPlayerFleetList, callback);
    },
    inProgressState: (p1Board, p2Board, callback) => {
      if (!isHTMLElement(p1Board)) throwError('p1Board', 'Element', p1Board);
      if (!isHTMLElement(p2Board)) throwError('p2Board', 'Element', p2Board);
      if (!(callback instanceof Function)) throwError('inProgressState callback', 'Function', callback);
      changeState(renderInProgressState, p1Board, p2Board, callback);
    },
    gameOverState: (winner, callback) => {
      if (!winner) throwError('winner', 'String', winner);
      if (!(callback instanceof Function)) throwError('gameOverState callback', 'Function', callback);
      changeState(renderGameOverState, winner, callback);
    },
    reset: () => {
      _currentStateController?.clearState();
      _currentStateController = null;
      _currentState = null;
    }
  };
}
