export const BoardController = ({ id, name, elements, emitterBundle }) => {
  const { trackingGrid, trackingFleet } = elements;
  const { emitter, getPlayerEventKey, getOpponentEventKey, EVENTS } = emitterBundle;

  const endTurn = () => emitter.publish(getPlayerEventKey(EVENTS.END_TURN));

  return {
    getId: () => id,
    getPlayerName: () => name,
    provideTrackingGrid: () => trackingGrid,
    provideTrackingFleet: () => trackingFleet
  };
};
