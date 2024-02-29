import { BaseBoardView } from './BaseBoardView';
import './board-style.css';

export const HvABoardView = ({
  scopedID,
  playerName,
  mainGridView,
  trackingGridView,
  fleetView
}) => {
  const base = BaseBoardView(scopedID, playerName, { mainGridView, trackingGridView, fleetView });
  let aiView = null;
  base.aiView = {
    setView: (newView) => (aiView = newView),
    display: () => {
      trackingGridView.attachToWrapper(aiView.getGridElement());
      base.trackingGrid.setFleet(aiView.getFleetElement());
    }
  };

  base.placement = {
    start: () => {
      base.trackingGrid.disable();
      base.trackingGrid.hide();
      base.buttons.submitPlacements.init();
      base.display();
    },
    end: () => {
      base.aiView.display();
      base.trackingGrid.enable();
      base.trackingGrid.show();
    }
  };

  return base;
};
