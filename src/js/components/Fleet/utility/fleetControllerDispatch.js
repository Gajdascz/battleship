import { PLACEMENT_EVENTS } from '../../../utility/constants/events';

export const dispatch = {
  submitPlacements: (placements) => {
    const event = new CustomEvent(PLACEMENT_EVENTS.SUBMITTED, {
      detail: {
        placements
      }
    });
    document.dispatchEvent(event);
  }
};
