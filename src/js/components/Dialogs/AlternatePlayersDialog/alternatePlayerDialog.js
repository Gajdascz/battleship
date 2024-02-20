const getAlternatePlayerDialog = () => {
  const headerObj = paragraphObj('', { class: 'alternate-player-header' });
  const playerNameObj = spanObj('', { class: 'next-player-name' });
  headerObj.children = [playerNameObj];
  const proceedButton = btnObj('Proceed', { class: 'proceed-to-next-player-button' });
  const dialogElement = buildElementTree({
    type: 'dialog',
    attributes: { class: 'alternate-player-dialog' },
    children: [playerNameObj, proceedButton]
  });
  const playerName = dialogElement.querySelector('.next-player-name');
  dialogElement
    .querySelector('.proceed-to-next-player-button')
    .addEventListener('click', (e) => dialogElement.close());
  return {
    element: dialogElement,
    get playerName() {
      return playerName.textContent;
    },
    set playerName(name) {
      playerName.textContent = `${name}'s Turn`;
    },
    hideScreen: () => dialogElement.showModal()
  };
};
