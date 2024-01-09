export default function renderManager({ boardContainer, currentPlayerDisplay, p1Board, p2Board }) {
  return {
    boardContainer,
    currentPlayerDisplay,
    p1Board,
    p2Board,
    get currentBoard() {
      boardContainer.querySelector('.board');
    },
    set currentBoard(newBoard) {
      const currentBoard = this.getCurrentBoard;
      if (currentBoard) currentBoard.remove();
      boardContainer.append(newBoard);
    },
    get currentPlayerName() {
      return currentPlayerDisplay.textContent;
    },
    set currentPlayerName(playerName) {
      currentPlayerDisplay.textContent = `${playerName}'s Turn`;
    }
  };
}
