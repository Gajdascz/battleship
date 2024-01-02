import buildGameBoard from './element-builders/buildGameBoard';

const renderGameBoard = () => {
  document.querySelector('div.board-container').append(buildGameBoard());
};

export { renderGameBoard };
