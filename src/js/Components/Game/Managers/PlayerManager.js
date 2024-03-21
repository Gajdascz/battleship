export const PlayerManager = (config) => {
  const { ids, controllers, controllerTypes, names, gameMode } = config;
  const getControllersOfType = (type) =>
    Object.fromEntries(
      Object.entries(controllers).map(([id, controller]) => [id, controller[type]])
    );
  const getPlayerName = (playerId) => names[playerId];

  const getOpponentName = (playerId) => {
    const opponentId = ids.find((storedId) => playerId !== storedId);
    if (opponentId) return names[opponentId];
  };
  const resetControllers = () => {
    Object.values(controllers).forEach((controller) => controller.reset());
  };
  return {
    ids,
    gameMode,
    controllerTypes,
    getPlayerName,
    getControllersOfType,
    getOpponentName,
    resetControllers,
    reset: () => {
      resetControllers();
      ids.forEach((id) => {
        delete controllers[id];
        delete names[id];
      });
    }
  };
};
