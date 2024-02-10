import { FLEET_MANAGER } from '../../../common/constants/baseConstants';

export const dispatch = {
  submitPlacements: (placements) => {
    const event = new CustomEvent(FLEET_MANAGER.EVENTS.PLACEMENTS_SUBMITTED, {
      detail: {
        placements
      }
    });
    document.dispatchEvent(event);
  }
};
