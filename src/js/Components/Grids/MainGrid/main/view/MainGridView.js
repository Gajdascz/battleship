import { MAIN_GRID } from '../../common/mainGridConstants';
import { buildMainGridUIObj } from './buildMainGridUIObj';
import './main-grid-styles.css';

export const MainGridView = ({ numberOfRows, numberOfCols, letterAxis }) => {
  const elements = {};
  const buildAndSetElements = () => {
    const { wrappedMainGridElement, submitPlacementsButtonElement } = buildMainGridUIObj({
      numberOfRows,
      numberOfCols,
      letterAxis
    });
    const grid = wrappedMainGridElement.querySelector(`.${MAIN_GRID.TYPE}`);
    Object.assign(elements, { wrappedMainGridElement, submitPlacementsButtonElement, grid });
  };

  const getCell = (coordinates) =>
    elements.grid.querySelector(MAIN_GRID.CELL_SELECTOR(coordinates));

  buildAndSetElements();
  return {
    getCell,
    attachTo: (container) => container.append(elements.wrappedMainGridElement),
    attachWithinWrapper: (element) => elements.wrappedMainGridElement.append(element),
    displayShipHit: (coordinates) => {
      const cell = getCell(coordinates);
      cell.classList.add(MAIN_GRID.CLASSES.HIT_MARKER);
    },
    elements: {
      getWrapper: () => elements.wrappedMainGridElement,
      getGrid: () => elements.grid,
      getSubmitPlacementsButton: () => elements.submitPlacementsButtonElement
    },
    reset: () => {
      buildAndSetElements();
    }
  };
};
