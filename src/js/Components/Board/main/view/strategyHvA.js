import './board-style.css';

export const StrategyHvA = (init, views, display, remove, acceptTrackingFleet) => {
  const { mainGrid, trackingGrid, fleet } = views;
  let aiTrackingGrid = null;
  let aiTrackingFleet = null;
  let buttonManager = null;
  const strategy = {
    initialize: (aiGrid, aiFleet) => {
      const { mainGridButtonManager } = init();
      aiTrackingGrid = aiGrid;
      aiTrackingFleet = aiFleet;
      trackingGrid.attachWithinWrapper(aiGrid);
      acceptTrackingFleet(aiFleet);
      buttonManager = mainGridButtonManager;
    },
    placement: {
      initialize: () => {
        const updateRotateButton = ({ data }) => {
          const { id } = data;
          buttonManager.updateButton('rotate-ship', fleet.getRotateShipButton(id));
        };
        return updateRotateButton;
      },
      startTurn: () => {
        trackingGrid.disable();
        trackingGrid.hide();
        buttonManager.addButton('submit-placements', mainGrid.getSubmitButton());
        buttonManager.addWrapper('rotate-ship');
        display();
      },
      endTurn: () => {
        buttonManager.removeWrapper('submit-placements');
        buttonManager.removeWrapper('rotate-ship');
        trackingGrid.show();
      }
    },
    combat: {
      onEnd: () => null,
      setEndTurnFn: (endFn) => (strategy.combat.onEnd = endFn),
      endTurn: () => {
        trackingGrid.disable();
        strategy.combat.onEnd();
      }
    }
  };
  return strategy;
};
