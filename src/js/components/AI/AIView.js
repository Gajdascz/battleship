import { MOUSE_EVENTS } from '../../utility/constants/events';
import { TrackingGridView } from '../Grids/TrackingGrid/view/TrackingGridView';

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

export const AIView = (boardSettings, aiName) => {
  const trackingGridView = buildAIDisplay(boardSettings, aiName);
  return {
    ...trackingGridView
  };
};
