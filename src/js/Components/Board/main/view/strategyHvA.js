import './board-style.css';

export const StrategyHvA = ({ initialize, views, display, acceptTrackingFleet }) => {
  const { mainGrid, trackingGrid, fleet } = views;
  let buttonManager = null;
  const strategy = {
    initialize: (aiGrid, aiFleet) => {
      const { mainGridButtonManager } = initialize();
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
      onEndTurn: () => null,
      startTurn: () => trackingGrid.enable(),
      attackSent: () => trackingGrid.disable(),
      setOnEndTurn: (onEndTurn) => (strategy.combat.onEndTurn = onEndTurn),
      endTurn: () => strategy.combat.onEnd()
    }
  };
  return strategy;
};
