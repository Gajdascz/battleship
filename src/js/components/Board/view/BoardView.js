import { COMMON_ELEMENTS } from '../../../utility/constants/dom/elements';
import { buildUIElement } from '../../../utility/uiBuilderUtils/uiBuilders';
import './board-style.css';

export const BoardView = (scopedID, { mainGridView, trackingGridView, fleetView }) => {
  const BOARD_CONTAINER_CLASS = 'board';
  const boardContainer = buildUIElement(COMMON_ELEMENTS.DIV, {
    attributes: { class: BOARD_CONTAINER_CLASS, id: scopedID }
  });

  boardContainer.append(mainGridView.elements.wrapper);
  boardContainer.append(trackingGridView.elements.wrapper);
  mainGridView.elements.wrapper.append(fleetView.elements.mainFleet);
  const submitPlacementsButtonWrapper = buildUIElement(COMMON_ELEMENTS.DIV, {
    attributes: { class: `submit-placements-button-wrapper` }
  });

  fleetView.elements.buttonContainer.append(submitPlacementsButtonWrapper);
  return {
    getBoardElement: () => boardContainer,
    setTrackingFleet: (opponentTrackingFleet) =>
      trackingGridView.elements.wrapper.append(opponentTrackingFleet),
    hideTrackingGrid: () => (trackingGridView.elements.wrapper.style.display = 'none'),
    showTrackingGrid: () => trackingGridView.elements.removeAttribute('style'),

    displaySubmitPlacementsButton: () =>
      submitPlacementsButtonWrapper.append(mainGridView.elements.submitBtn),
    disableSubmitPlacementsButton: () => mainGridView.placement.submit.disable(),
    enableSubmitPlacementsButton: () => mainGridView.placement.submit.enable()
  };
};
