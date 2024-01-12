import renderStateManager from './renderManager';
import initiateRender from './initiateRender';

export default (() => {
  const renderManager = { current: renderStateManager() };
  const cleanRenderManager = () => {
    renderManager.current.reset();
    delete renderManager.current;
    renderManager.current = renderStateManager();
    renderManager.current.addStateTransitionListeners({
      state: 'gameInitiateState',
      events: new Map([['gameStarted', [initiate]]])
    });
  };
  function initiate(e) {
    if (!renderManager.current || !renderManager.current.isClean()) cleanRenderManager();
    initiateRender(e, renderManager.current);
    renderManager.current.addStateTransitionListeners({
      state: 'gamePlacementState',
      events: new Map([
        ['gamePlacementState', [renderPlacementStateUI]],
        ['placementsProcessed', [renderManager.current.clearState]],
        ['gameInProgressState', [renderInProgressStateUI]]
      ])
    });
  }
  function renderPlacementStateUI(e) {
    const { callback } = e.detail;
    renderManager.current?.hideScreen?.();
    renderManager.current.syncCurrentPlayer();
    renderManager.current.placementState(callback);
  }

  function renderInProgressStateUI(e) {
    const { callback } = e.detail;
    renderManager.current.inProgressState(callback);
    renderManager.current.removeStateTransitionListeners('gamePlacementState');
    renderManager.current.syncCurrentPlayer();
    renderManager.current.addStateTransitionListeners({
      state: 'gameInProgressState',
      events: new Map([['playerSwitched', [renderManager.current.renderStrategy]]])
    });
    renderManager.current.addStateTransitionListeners({
      state: 'gameOverState',
      events: new Map([['gameOverState', [renderManager.current.clearState, renderGameOverStateUI]]])
    });
  }

  function renderGameOverStateUI(e) {
    const { winner, callback } = e.detail;
    renderManager.current.gameOverState(winner, callback);
    renderManager.current.removeStateTransitionListeners('gameInProgressState');
  }

  cleanRenderManager();
})();
