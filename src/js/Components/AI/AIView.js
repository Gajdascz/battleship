import { AIShipView } from './components/Ship/AIShipView';
import { AIFleetView } from './components/Fleet/AIFleetView';
import { AITrackingGridView } from './components/TrackingGrid/AITrackingGridView';

const buildAIFleet = (shipNames) => {
  const fleetView = AIFleetView();
  shipNames.forEach((name) => {
    const shipView = AIShipView(name);
    const id = name.toLowerCase().replace(/' '/, '-');
    fleetView.addShipView(id, shipView);
  });
  fleetView.populateFleetShipLists();
  return fleetView;
};
export const AIView = (boardSettings, aiName, shipNames) => {
  const trackingGrid = AITrackingGridView(boardSettings, aiName);
  trackingGrid.displayResult = (coordinates, result) => {
    const cell = trackingGrid.getCell(coordinates);
    trackingGrid.setCellStatus(cell, result);
  };
  const fleet = buildAIFleet(shipNames);
  return { trackingGrid, fleet };
};
