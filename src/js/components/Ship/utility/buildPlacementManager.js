import { ToggleOrientation } from '../commands/ToggleOrientation';
import { SelectShip } from '../commands/SelectShip';
import { DeselectShip } from '../commands/DeselectShip';
import { PlaceShip } from '../commands/PlaceShip';
import { PickupShip } from '../commands/PickupShip';
import { PlacementManager } from './PlacementManager';

export const buildPlacementManager = (model, view) =>
  PlacementManager({
    enableOrientationToggle: view.enableOrientationToggle,
    disableOrientationToggle: view.disableOrientationToggle,
    enableRequestSelection: view.enableRequestSelection,
    disableRequestSelection: view.disableRequestSelection,
    enableRequestPlacement: view.enableRequestPlacement,
    disableRequestPlacement: view.disableRequestPlacement,
    isPlaced: model.isPlaced,
    getID: model.getID,
    toggleOrientationCommand: ToggleOrientation({
      toggleFn: model.toggleOrientation,
      getOrientation: model.getOrientation,
      getLength: model.getLength,
      updateOrientationView: view.updateOrientation
    }),
    selectShipCommand: SelectShip({
      updateSelectedStatusView: view.updateSelectedStatus,
      getID: model.getID,
      getLength: model.getLength,
      getOrientation: model.getOrientation
    }),
    deselectShipCommand: DeselectShip({
      setIsSelected: model.setIsSelected,
      updateSelectedStatusView: view.updateSelectedStatus
    }),
    placeShipCommand: PlaceShip({
      setPlacedCoordinates: model.setPlacedCoordinates,
      setIsPlaced: model.setIsPlaced,
      updatePlacementStatusView: view.updatePlacementStatus,
      getID: model.getID,
      getLength: model.getLength
    }),
    pickupShipCommand: PickupShip({
      clearPlacedCoordinates: model.clearPlacedCoordinates,
      setIsPlaced: model.setIsPlaced,
      updatePlacementStatusView: view.updatePlacementStatus
    })
  });
