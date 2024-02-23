import { MOUSE_EVENTS } from '../../utility/constants/events';

const AI_DISPLAY = {
  CLASSES: {
    GRID: 'ai-display-tracking-grid',
    HEADER: 'ai-display-header tracking-grid-header'
  },
  TEXTS: {
    HEADER: (aiName) => `${aiName}'s Attacks`
  }
};

export const trackingGridToAIDisplay = (trackingGridView, aiName) => {
  const trackingGrid = trackingGridView.getGridElement();
  trackingGrid.classList.add(AI_DISPLAY.CLASSES.GRID);
  const header = trackingGrid.querySelector('.tracking-grid-header');
  const headerText = trackingGrid.querySelector('.tracking-grid-header > p');
  header.classList.add(AI_DISPLAY.CLASSES.HEADER);
  headerText.textContent = AI_DISPLAY.TEXTS.HEADER(aiName);
  trackingGrid.querySelectorAll('button.grid-cell').forEach((cell) => {
    cell.setAttribute('disabled', true);
    cell.addEventListener(MOUSE_EVENTS.CLICK, () => window.alert(`NO!`));
  });
};
