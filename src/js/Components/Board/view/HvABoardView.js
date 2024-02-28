import { BaseBoardView } from './BaseBoardView';
import './board-style.css';

export const HvABoardView = ({
  scopedID,
  playerName,
  mainGridView,
  trackingGridView,
  fleetView
}) => {
  console.log(scopedID, playerName, mainGridView, trackingGridView, fleetView);
  const base = BaseBoardView(scopedID, playerName, { mainGridView, trackingGridView, fleetView });
  let aiView = null;
  base.aiView = {
    setView: (newView) => (aiView = newView),
    display: () => trackingGridView.attachToWrapper(aiView.getGridElement())
  };

  return base;
};
