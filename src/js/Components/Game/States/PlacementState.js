export const PlacementState = ({
  endCurrentPlayerTurn,
  getCurrentPlayerId,
  playerIds,
  placementControllers,
  eventMethods,
  eventGetters
}) => {
  const { on, off, emit } = eventMethods;
  const { getGlobal, getBaseTypes, getScoped } = eventGetters;
  const PLACEMENT_OVER = getGlobal().PLACEMENT_OVER;
  let finalized = {};

  const onFinalize = ({ data }) => {
    finalized[data] = true;
    endCurrentPlayerTurn();
    if (playerIds.every((id) => finalized[id])) emit(PLACEMENT_OVER);
    else start();
  };

  const setupFinalizePlacement = (id) => {
    const { FINALIZE_PLACEMENT } = getScoped(id, getBaseTypes().PLACEMENT);
    on(FINALIZE_PLACEMENT, onFinalize);
    return () => {
      emit(FINALIZE_PLACEMENT, id);
      off(FINALIZE_PLACEMENT, onFinalize);
    };
  };

  const start = () => {
    const currentId = getCurrentPlayerId();
    const finalizePlacement = setupFinalizePlacement(currentId);
    placementControllers[currentId].start(finalizePlacement);
  };

  const reset = () => (finalized = {});

  return {
    start,
    reset
  };
};
