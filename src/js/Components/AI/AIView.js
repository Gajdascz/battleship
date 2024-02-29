import { MOUSE_EVENTS } from '../../Utility/constants/dom/domEvents';
import { TrackingGridView } from '../Grids/TrackingGrid/view/TrackingGridView';
import { AIShipView } from './components/Ship/AIShipView';
import { AIFleetView } from './components/Fleet/AIFleetView';

const AI_DISPLAY = {
  CLASSES: {
    GRID: 'ai-display-tracking-grid',
    HEADER: 'ai-display-header'
  },
  TEXTS: {
    HEADER: (aiName) => `${aiName}'s Attacks`
  }
};

const buildAIDisplay = (boardSettings, aiName) => {
  const trackingGridView = TrackingGridView(boardSettings);
  const trackingGridElement = trackingGridView.getGridElement();
  trackingGridElement.classList.add(AI_DISPLAY.CLASSES.GRID);
  const header = trackingGridElement.querySelector('.tracking-grid-header');
  const headerText = trackingGridElement.querySelector('.tracking-grid-header > p');
  header.classList.add(AI_DISPLAY.CLASSES.HEADER);
  headerText.textContent = AI_DISPLAY.TEXTS.HEADER(aiName);
  trackingGridElement.querySelectorAll('button.grid-cell').forEach((cell) => {
    cell.setAttribute('disabled', true);
    cell.addEventListener(MOUSE_EVENTS.CLICK, () => window.alert(`NO!`));
  });
  return trackingGridView;
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
  const trackingGridView = buildAIDisplay(boardSettings, aiName);
  const fleetView = buildAIFleet(shipNames);
  return {
    ...trackingGridView,
    getFleetElement: () => fleetView.getTrackingFleet()
  };
};
