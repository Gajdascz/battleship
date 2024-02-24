import { PUBLISHER_KEYS } from '../utility/buildPublisher';
import { convertToInternalFormat } from '../../../utility/utils/coordinatesUtils';
export const ShipPlacementController = ({ model, view, publisher, selectionController }) => {
  const deselectFn = selectionController.deselect;
  const isReady = () => view.selection.isInitialized && view.placement.isInitialized;

  const emitReadyForPlacement = () => {
    if (isReady()) publisher.execute(PUBLISHER_KEYS.ACTIONS.READY_FOR_PLACEMENT);
  };
  const request = () =>
    publisher.request(PUBLISHER_KEYS.REQUESTS.PLACEMENT, {
      id: model.getID(),
      scopedID: model.getScopedID(),
      length: model.getLength()
    });
  const place = ({ data }) => {
    const { placedCoordinates } = data;
    if (deselectFn) deselectFn();
    const internal = placedCoordinates.map((coordinates) => convertToInternalFormat(coordinates));
    model.setPlacedCoordinates({ internal, display: placedCoordinates });
    model.setIsPlaced(true);
    view.update.placementStatus(true);
    publisher.execute(PUBLISHER_KEYS.ACTIONS.PLACEMENT_SET, { scopedID: model.getScopedID() });
  };
  const pickup = () => {
    model.clearPlacedCoordinates();
    model.setIsPlaced(false);
    view.update.placementStatus(false);
  };

  return {
    enable: ({ data }) => {
      selectionController.setPickupFn(pickup);
      const { container } = data;
      view.placement.initialize({
        placementContainer: container,
        placeCallback: request
      });
      emitReadyForPlacement();
    },
    place
  };
};
