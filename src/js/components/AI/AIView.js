const trackingGridToAIDisplay = (trackingGrid, aiName) => {
  trackingGrid.classList.add('ai-display-tracking-grid');
  const header = trackingGrid.querySelector('.tracking-grid-header');
  const headerText = trackingGrid.querySelector('.tracking-grid-header > p');
  header.classList.add('ai-display-header');
  headerText.textContent = `${aiName}'s Attacks`;
  trackingGrid
    .querySelectorAll('button.grid-cell')
    .forEach((cell) => cell.setAttribute('disabled', true));
  return trackingGrid;
};
