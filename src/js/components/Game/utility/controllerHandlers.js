import { publish } from './controllerPublishers';

export const handle = {
  startGame: (model) =>
    publish.start.gameStarted({
      mode: model.getGameMode(),
      currentPlayer: model.getCurrentPlayer(),
      opponentPlayer: model.getOpponentPlayer()
    }),
  placementState: {
    setToPlacementState: () => publish.placement.placementState()
  },
  switchPlayer: (model) => {
    model.switchPlayer();
    return { currentPlayer: model.getCurrentPlayer() };
  },
  transitionState: (state) => {}
};
