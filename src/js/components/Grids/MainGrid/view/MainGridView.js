import { MAIN_GRID } from '../utility/mainGridConstants';
import { buildMainGridUIObj } from './buildMainGridUIObj';
import './main-grid-styles.css';
import { MainGridPlacementView } from '../Placement/MainGridPlacementView';

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

  const previewConfig = {
    gridElement: wrappedMainGridElement,
    getCell,
    maxVertical: numberOfRows - 1,
    maxHorizontal: numberOfCols - 1,
    letterAxis
  };

  const placementView = MainGridPlacementView({
    elements: { mainGridElement, submitPlacementsButtonElement },
    previewConfig
  });

  return {
    getCell,
    attachTo: (container) => container.append(wrappedMainGridElement),
    attachToWrapper: (element) => wrappedMainGridElement.append(element),
    placement: {
      initialize: (submitPlacementsCallback) => placementView.initialize(submitPlacementsCallback),
      processRequest: ({ id, length }) => placementView.placement.processRequest({ id, length }),
      submitButton: placementView.placement.submitButton,
      preview: {
        updateSelectedShip: ({ id, length, orientation }) =>
          placementView.preview.updateSelectedShip({ id, length, orientation }),
        updateOrientation: (orientation) => placementView.preview.updateOrientation(orientation)
      },
      end: () => placementView.end()
    },
    displayShipHit,
    elements: {
      getWrapper: () => wrappedMainGridElement,
      getGrid: () => mainGridElement,
      getSubmitButton: () => submitPlacementsButtonElement
    },
    getPreviewConfig: () => previewConfig
  };
};
