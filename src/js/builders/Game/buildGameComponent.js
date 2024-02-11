import { GameModel } from '../../components/Game/GameModel';
import { GameView } from '../../components/Game/GameView';
import { GameController } from '../../components/Game/GameController';

export const buildGameComponent = () => {
  const model = GameModel();
  const view = GameView();
  const controller = GameController(model, view);
  return controller;
};
