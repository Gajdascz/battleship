import { publish } from './controllerPublishers';

export const handle = {
  startGame: (model) =>
    publish.start.gameStarted({
      mode: model.getGameMode(),
      p1: model.getPlayerOne(),
      p2: model.getPlayerTwo(),
      currentPlayer: model.getCurrentPlayer(),
      opponentPlayer: model.getOpponentPlayer()
    }),
  switchPlayer: (model) => {
    model.switchPlayer();
    return { currentPlayer: model.getCurrentPlayer() };
  },
  transitionState: (state) => {}
};
