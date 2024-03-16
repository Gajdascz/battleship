export const BoardPlacementView = ({
  buttonManager,
  fleet,
  mainGrid,
  trackingGrid,
  display,
  remove
}) => {
  const init = () => {
    const updateRotateButton = ({ data }) => {
      const { id } = data;
      buttonManager.updateButton('rotate-ship', fleet.getRotateShipButton(id));
    };
    const removeRotateButton = () => buttonManager.removeButton('rotate-ship');
    return { removeRotateButton, updateRotateButton };
  };
  const startTurn = () => {
    trackingGrid.disable();
    trackingGrid.hide();
    buttonManager.addButton('submit-placements', mainGrid.getSubmitButton());
    buttonManager.addWrapper('rotate-ship');
    display();
  };
  const endTurn = () => {
    buttonManager.removeWrapper('submit-placements');
    buttonManager.removeWrapper('rotate-ship');
    trackingGrid.show();
    remove();
  };
  return {
    init,
    startTurn,
    endTurn
  };
};
