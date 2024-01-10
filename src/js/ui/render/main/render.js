import renderStateManager from './renderManager';
import initiateRender from './initiateRender';

export default (() => {
  const renderManager = renderStateManager();
  renderManager.addStateTransitionListeners({
    state: 'gameInitiateState',
    events: new Map([['gameStarted', [initiate]]])
  });
  function initiate(e) {
    initiateRender(e, renderManager);
    renderManager.addStateTransitionListeners({
      state: 'gamePlacementState',
      events: new Map([
        ['gamePlacementState', [renderPlacementStateUI]],
        ['placementsProcessed', [renderManager.clearState]],
        ['gameInProgressState', [renderInProgressStateUI]]
      ])
    });
  }
  function renderPlacementStateUI(e) {
    const { callback } = e.detail;
    renderManager?.hideScreen?.();
    renderManager.syncCurrentPlayer();
    renderManager.placementState(callback);
  }

  function renderInProgressStateUI(e) {
    const { callback } = e.detail;
    renderManager.inProgressState(callback);
    renderManager.removeStateTransitionListeners('gamePlacementState');
    renderManager.syncCurrentPlayer();
    renderManager.addStateTransitionListeners({
      state: 'gameInProgressState',
      events: new Map([['playerSwitched', [renderManager.renderStrategy]]])
    });
    renderManager.addStateTransitionListeners({
      state: 'gameOverState',
      events: new Map([['gameOverState', [renderManager.clearState, renderGameOverStateUI]]])
    });
  }

  function renderGameOverStateUI(e) {
    console.log('gameOver');
  }
})();
