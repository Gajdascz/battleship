import { getGameOverDialog } from '../../../../gameStateElements';

export default function renderGameOverState(winner, callback) {
  const gameOverDialog = getGameOverDialog();
  gameOverDialog.winner = winner;
  gameOverDialog.element.querySelector('.play-again-button').addEventListener('click', (e) => {
    callback();
    gameOverDialog.element.remove();
  });
  document.querySelectorAll('button.grid-cell').forEach((cell) => cell.setAttribute('disabled', 'true'));
  document.querySelector('body').append(gameOverDialog.element);
  gameOverDialog.element.showModal();
}
