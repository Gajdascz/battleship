import { COMMON_ELEMENTS } from '../../utility/constants/dom/elements';
import { buildUIElement } from '../../utility/uiBuilderUtils/uiBuilders';
export const BoardView = (componentViews, boardID) => {
  const { mainGridView, trackingGridView, fleetView } = componentViews;
  const BOARD_CONTAINER_CLASS = 'board';
  const boardContainer = buildUIElement(COMMON_ELEMENTS.DIV, {
    attributes: { class: BOARD_CONTAINER_CLASS, id: boardID }
  });

  boardContainer.append(mainGridView.elements.wrapper);
  boardContainer.append(trackingGridView.elements.wrapper);
  mainGridView.elements.wrapper.append(fleetView.elements.mainFleet);
  const submitPlacementsButtonWrapper = buildUIElement(COMMON_ELEMENTS.DIV, {
    attributes: { class: `submit-placements-button-wrapper` }
  });

  fleetView.elements.buttonContainer.append(submitPlacementsButtonWrapper);
  return {
    attachBoard: (container) => container.append(boardContainer),
    setTrackingFleet: (opponentTrackingFleet) =>
      trackingGridView.elements.wrapper.append(opponentTrackingFleet),
    hideTrackingGrid: () => trackingGridView.elements.wrapper.classList.add('hide'),
    displaySubmitPlacementsButton: () =>
      submitPlacementsButtonWrapper.append(mainGridView.elements.submitBtn),
    disableSubmitPlacementsButton: () => (mainGridView.elements.submitBtn.disabled = true),
    enableSubmitPlacementsButton: () => (mainGridView.elements.submitBtn.disabled = false)
  };
};
