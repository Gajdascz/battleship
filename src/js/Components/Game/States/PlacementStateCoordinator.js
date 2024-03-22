/**
 * Orchestrates the game's placement state.
 *
 * @param {Object} detail Information and methods to execute placement state.
 * @returns {Object} Methods to start and reset the state.
 */
export const PlacementStateCoordinator = ({
  endCurrentPlayerTurn,
  getCurrentPlayerId,
  playerIds,
  placementControllers,
  eventMethods,
  eventGetters,
  transition
}) => {
  const { on, off, emit } = eventMethods;
  const { getBaseTypes, getScoped } = eventGetters;
  let finalized = {};

  const onFinalize = ({ data }) => {
    finalized[data] = true;
    endCurrentPlayerTurn();
    if (playerIds.every((id) => finalized[id])) transition();
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

  const reset = () => {
    finalized = {};
    Object.values(placementControllers).forEach((controller) => controller.end());
  };

  return {
    start,
    reset
  };
};
