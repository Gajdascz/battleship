import { MAIN_GRID } from '../utility/mainGridConstants';
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

  const displayShipHit = (coordinates) =>
    getCell(coordinates[0], coordinates[1]).classList.add(MAIN_GRID.CLASSES.HIT_MARKER);

  return {
    getCell,
    attachTo: (container) => container.append(wrappedMainGridElement),
    attachToWrapper: (element) => wrappedMainGridElement.append(element),
    elements: {
      getWrapper: () => wrappedMainGridElement,
      getGrid: () => mainGridElement,
      getSubmitPlacementsButton: () => submitPlacementsButtonElement
    }
  };
};
