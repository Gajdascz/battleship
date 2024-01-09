import inProgressStateManager from './inProgressStateManager';
import inProgressStateListeners from './inProgressStateListeners';

export default function renderInProgressState(p1Board, p2Board, onPlayerAttack) {
  const stateManager = inProgressStateManager(p1Board, p2Board, onPlayerAttack);
  const stateListeners = inProgressStateListeners(stateManager);
  stateListeners.init();
  document.addEventListener('playerAttacked', onPlayerAttack);
  return {
    clearState: function () {
      stateListeners.remove();
      document.removeEventListener('playerAttacked', onPlayerAttack);
    }
  };
}
