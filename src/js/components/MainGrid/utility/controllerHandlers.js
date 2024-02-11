import { MOUSE_EVENTS } from '../../../utility/constants/events';
import { COMMON_GRID } from '../../../utility/constants/components/grids';

const _target = {};

export const handle = {
  placementState: {
    gridElement: null,
    listenForTargetCell: (element) =>
      element.addEventListener(
        MOUSE_EVENTS.OVER,
        (e) => (_target.cell = e.target.closest(COMMON_GRID.CELL_SELECTOR))
      ),
    initiate: (gridElement) => {
      g;
    },
    shipSelect: (detail, view) => {
      const { length, orientation } = detail;
      const mainGridElement = view.getElement();
      handle.placementState.listenForTargetCell(mainGridElement);
    }
  }
};
