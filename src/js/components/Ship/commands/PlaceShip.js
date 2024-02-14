import { publish } from '../utility/publishers';

export const PlaceShip = ({
  setPlacedCoordinates,
  setIsPlaced,
  updatePlacementStatusView,
  getID,
  getLength
}) => {
  const _setPlacedCoordinates = setPlacedCoordinates;
  const _setIsPlaced = setIsPlaced;
  const _updatePlacementStatusView = updatePlacementStatusView;
  const _getID = getID;
  const _getLength = getLength;
  return {
    execute: (coordinates) => {
      _setPlacedCoordinates(coordinates);
      _setIsPlaced(true);
      _updatePlacementStatusView(true);
    },
    request: (e) => {
      if (e.button !== 0) return;
      publish.placementRequested({ id: _getID(), length: _getLength() });
    }
  };
};
