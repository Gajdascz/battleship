import { MOUSE_EVENTS } from '../../../../Utility/constants/dom/domEvents';
import { TrackingGridView } from '../../../Grids/TrackingGrid/main/view/TrackingGridView';

const AI_TRACKING_GRID = {
  CLASSES: {
    GRID: 'ai-display-tracking-grid',
    HEADER: 'ai-display-header'
  },
  TEXTS: {
    HEADER: (aiName) => `${aiName}`
  }
};

export const AITrackingGridView = (boardSettings, aiName) => {
  const trackingGridView = TrackingGridView(boardSettings);
  const trackingGridElement = trackingGridView.elements.getGrid();
  trackingGridElement.classList.add(AI_TRACKING_GRID.CLASSES.GRID);
  const header = trackingGridElement.querySelector('.tracking-grid-header');
  const headerText = trackingGridElement.querySelector('.tracking-grid-header > p');
  header.classList.add(AI_TRACKING_GRID.CLASSES.HEADER);
  headerText.textContent = AI_TRACKING_GRID.TEXTS.HEADER(aiName);
  trackingGridElement.querySelectorAll('button.grid-cell').forEach((cell) => {
    cell.setAttribute('disabled', true);
    cell.addEventListener(MOUSE_EVENTS.CLICK, () => window.alert(`NO!`));
  });
  return trackingGridView;
};
