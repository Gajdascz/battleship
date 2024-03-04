import { BaseBoardView } from './BoardView';
import './board-style.css';

export const HvAStrategy = ({
  scopedID,
  playerName,
  mainGridView,
  trackingGridView,
  fleetView
}) => {
  const base = BaseBoardView(scopedID, playerName, { mainGridView, trackingGridView, fleetView });
  let aiView = null;
  const stragey = {
    setAiView: (view) => (aiView = view)
  };

  base.aiView = {
    setView: (newView) => (aiView = newView),
    display: () => {
      trackingGridView.attachToWrapper(aiView.getGridElement());
      base.trackingGrid.setFleet(aiView.getFleetElement());
    }
  };

  base.placement = {
    initialize: () => {
      base.trackingGrid.disable();
      base.trackingGrid.hide();
      base.buttons.submitPlacements.init();
    },
    onTurnStart: () => {
      base.display();
    },
    end: () => {
      base.aiView.display();
      base.trackingGrid.show();
    }
  };
  return base;
};
