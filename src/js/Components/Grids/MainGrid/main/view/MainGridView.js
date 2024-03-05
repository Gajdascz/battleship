import { MAIN_GRID } from '../../common/mainGridConstants';
import { buildMainGridUIObj } from './buildMainGridUIObj';
import './main-grid-styles.css';

const ELEMENT_IDS = {
  GRID: 'mainGrid',
  WRAPPER: 'mainGridWrapper',
  SUBMIT_PLACEMENTS_BUTTON: 'submitPlacementsButton'
};

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
    elements: {
      getWrapper: () => wrappedMainGridElement,
      getGrid: () => mainGridElement,
      getSubmitPlacementsButton: () => submitPlacementsButtonElement
    }
  };
};
