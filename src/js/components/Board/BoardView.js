import { COMMON_ELEMENTS } from '../../utility/constants/dom/elements';
import { buildUIElement } from '../../utility/uiBuilderUtils/uiBuilders';
export const BoardView = (componentViews) => {
  const { mainGridView, trackingGridView, fleetView } = componentViews;
  const BOARD_CONTAINER_CLASS = 'board';
  const boardContainer = buildUIElement(COMMON_ELEMENTS.DIV, {
    attributes: { class: BOARD_CONTAINER_CLASS }
  });

  return {
    attachBoard: (container) => container.append(boardContainer)
  };
};
