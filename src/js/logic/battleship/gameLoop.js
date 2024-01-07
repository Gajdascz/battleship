import renderModule from '../../ui/render/render';

export default function gameLoopModule(controller) {
  const _controller = controller;

  function start() {
    const render = renderModule(_controller.boardOptions);
    render.currentPlayer(_controller.currentPlayer.name);
    render.board(_controller.currentPlayer, _controller.state);
  }

  return { start };
}
