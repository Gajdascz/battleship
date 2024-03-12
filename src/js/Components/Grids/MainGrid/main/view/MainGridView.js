import { MAIN_GRID } from '../../common/mainGridConstants';
import { buildMainGridUIObj } from './buildMainGridUIObj';
import './main-grid-styles.css';

export const MainGridView = ({ numberOfRows, numberOfCols, letterAxis }) => {
  const { wrappedMainGridElement, submitPlacementsButtonElement } = buildMainGridUIObj({
    numberOfRows,
    numberOfCols,
    letterAxis
  });

  const mainGridElement = wrappedMainGridElement.querySelector(`.${MAIN_GRID.TYPE}`);

  const getCell = (coordinates) =>
    mainGridElement.querySelector(MAIN_GRID.CELL_SELECTOR(coordinates));

  return {
    getCell,
    attachTo: (container) => container.append(wrappedMainGridElement),
    attachWithinWrapper: (element) => wrappedMainGridElement.append(element),
    displayShipHit: (coordinates) => {
      const cell = getCell(coordinates);
      cell.classList.add(MAIN_GRID.CLASSES.HIT_MARKER);
    },
    elements: {
      getWrapper: () => wrappedMainGridElement,
      getGrid: () => mainGridElement,
      getSubmitPlacementsButton: () => submitPlacementsButtonElement
    }
  };
};
