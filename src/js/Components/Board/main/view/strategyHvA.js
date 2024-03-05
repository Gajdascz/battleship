import './board-style.css';

export const StrategyHvA = (init, views, display, remove) => {
  const { mainGrid, trackingGrid, fleet } = views;
  let aiTrackingGrid = null;
  let aiTrackingFleet = null;
  let buttonManager = null;
  const strategy = {
    initialize: (aiGrid, aiFleet) => {
      const { mainGridButtonManager, setTrackingFleet } = init();
      console.log(mainGridButtonManager, setTrackingFleet);
      aiTrackingGrid = aiGrid;
      aiTrackingFleet = aiFleet;
      trackingGrid.attachWithinWrapper(aiGrid);
      setTrackingFleet(aiFleet);
      buttonManager = mainGridButtonManager;
    },
    placement: {
      startTurn: () => {
        trackingGrid.disable();
        trackingGrid.hide();
        buttonManager.addButton('submit-placements', mainGrid.getSubmitButton());
        buttonManager.addWrapper('rotate-ship');
        const updateRotateButton = ({ data }) => {
          const { id } = data;
          buttonManager.updateButton('rotate-ship', fleet.getRotateShipButton(id));
        };
        display();
        return updateRotateButton;
      },
      endTurn: () => {
        buttonManager.removeWrapper('submit-placements');
        buttonManager.removeWrapper('rotate-ship');
        trackingGrid.show();
      }
    },
    combat: {
      startTurn: () => {
        trackingGrid.enable();
      },
      endTurn: () => {
        trackingGrid.disable();
      }
    }
  };
  return strategy;
};
