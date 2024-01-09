export default function inProgressStateListeners(inProgressStateManager) {
  return {
    init: function () {
      document.addEventListener('attackProcessed', inProgressStateManager.renderProcessedAttack);
      inProgressStateManager.p1TrackingGrid.addEventListener('click', inProgressStateManager.sendAttack);
      inProgressStateManager.p2TrackingGrid.addEventListener('click', inProgressStateManager.sendAttack);
    },
    remove: function () {
      document.removeEventListener('attackProcessed', inProgressStateManager.renderProcessedAttack);
      inProgressStateManager.p1TrackingGrid.removeEventListener('click', inProgressStateManager.sendAttack);
      inProgressStateManager.p2TrackingGrid.removeEventListener('click', inProgressStateManager.sendAttack);
    }
  };
}
