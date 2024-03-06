import { MOUSE_EVENTS } from '../../Utility/constants/dom/domEvents';
import { TrackingGridView } from '../Grids/TrackingGrid/main/view/TrackingGridView';
import { AIShipView } from './components/Ship/AIShipView';
import { AIFleetView } from './components/Fleet/AIFleetView';
import { AITrackingGridView } from './components/TrackingGrid/AITrackingGridView';

const AI_DISPLAY = {
  CLASSES: {
    GRID: 'ai-display-tracking-grid',
    HEADER: 'ai-display-header'
  },
  TEXTS: {
    HEADER: (aiName) => `${aiName}'s Attacks`
  }
};

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
  const fleet = buildAIFleet(shipNames);
  return { trackingGrid, fleet };
};
