export const PickupShip = ({ clearPlacedCoordinates, setIsPlaced, updatePlacementStatusView }) => {
  const _clearPlacedCoordinates = clearPlacedCoordinates;
  const _setIsPlaced = setIsPlaced;
  const _updatePlacementStatusView = updatePlacementStatusView;
  return {
    execute: () => {
      _clearPlacedCoordinates();
      _setIsPlaced(false);
      _updatePlacementStatusView(false);
    }
  };
};
