import { isHTMLElement, throwError } from '../managerUtilities';
import renderPlacementState from '../../gameState/placement/renderPlacementState';
import renderInProgressState from '../../gameState/progress/renderInProgressState';
import renderGameOverState from '../../gameState/over/renderGameOverState';

export default function StateManager() {
  let _currentState = null;
  let _currentStateController = null;

  function changeState(newState, ...args) {
    _currentStateController?.clearState();
    _currentState = newState;
    _currentStateController = newState(...args);
  }

  const placementState = (currentBoard, currentPlayerFleetList, onPlacementSubmission) => {
    if (!isHTMLElement(currentBoard)) throwError('currentBoard', 'Element', currentBoard);
    if (!isHTMLElement(currentPlayerFleetList)) {
      throwError('currentPlayerFleetList', 'Element', currentPlayerFleetList);
    }
    if (!(onPlacementSubmission instanceof Function)) {
      throwError('placementState callback', 'Function', onPlacementSubmission);
    }
    changeState(renderPlacementState, currentBoard, currentPlayerFleetList, onPlacementSubmission);
  };
  const inProgressState = (p1Board, p2Board, onPlayerAttack) => {
    if (!isHTMLElement(p1Board)) throwError('p1Board', 'Element', p1Board);
    if (!isHTMLElement(p2Board)) throwError('p2Board', 'Element', p2Board);
    if (!(onPlayerAttack instanceof Function))
      throwError('inProgressState callback', 'Function', onPlayerAttack);
    changeState(renderInProgressState, p1Board, p2Board, onPlayerAttack);
  };
  const gameOverState = (winner) => {
    if (!winner) throwError('winner', 'String', winner);
    changeState(renderGameOverState, winner);
  };
  return {
    get currentState() {
      return _currentState;
    },
    renderPlacementStateUI: (currentBoard, currentFleetList, onPlacementSubmission) => {
      placementState(currentBoard, currentFleetList, onPlacementSubmission);
    },
    renderInProgressStateUI: (p1Board, p2Board, onPlayerAttack) => {
      inProgressState(p1Board, p2Board, onPlayerAttack);
    },
    renderGameOverStateUI: (winner, onReset) => gameOverState(winner, onReset),
    hasState: () => _currentState && _currentStateController,
    reset: () => {
      _currentStateController?.clearState();
      _currentStateController = null;
      _currentState = null;
    }
  };
}
