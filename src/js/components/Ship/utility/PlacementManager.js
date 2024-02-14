export const PlacementManager = ({
  toggleOrientationCommand,
  selectShipCommand,
  deselectShipCommand,
  placeShipCommand,
  pickupShipCommand,
  enableOrientationToggle,
  disableOrientationToggle,
  enableRequestSelection,
  disableRequestSelection,
  enableRequestPlacement,
  disableRequestPlacement,
  isPlaced,
  getID
}) => {
  const handleSelectRequest = (detail) => {
    if (detail.id === getID()) select();
    else deselect();
  };
  const handlePlacement = (detail) => {
    const { id, placedCoordinates } = detail;
    if (id === getID()) place(placedCoordinates);
  };

  const select = () => {
    enableOrientationToggle(toggleOrientationCommand.execute);
    enableRequestPlacement(placeShipCommand.request);
    if (isPlaced()) pickup();
    selectShipCommand.execute();
  };
  const deselect = () => {
    disableOrientationToggle(toggleOrientationCommand.execute);
    disableRequestPlacement(placeShipCommand.request);
    deselectShipCommand.execute();
  };

  const place = (coordinates) => {
    deselect();
    placeShipCommand.execute(coordinates);
  };
  const pickup = () => {
    pickupShipCommand.execute();
  };

  return {
    enablePlacementSettings: () => {
      enableRequestSelection(selectShipCommand.request);
    },
    disablePlacementSettings: () => {
      disableRequestSelection(selectShipCommand.request);
      disableOrientationToggle(toggleOrientationCommand.execute);
      disableRequestPlacement(placeShipCommand.request);
    },
    handleSelectRequest,
    handlePlacement
  };
};
