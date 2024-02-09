import { GameOverDialogController } from './GameOverDialogController';
import { ELEMENT_TYPES, GRID } from '../../common/constants/baseConstants';

export default function renderGameOverState(winner) {
  document
    .querySelectorAll(`${ELEMENT_TYPES.BUTTON}.${GRID.CELL_CLASS}`)
    .forEach((cell) => cell.setAttribute('disabled', 'true'));

  const dialogController = GameOverDialogController();
  dialogController.winner = winner;
  document.querySelector('body').append(dialogController.element);
  dialogController.element.showModal();
}
