import { convertToInternalFormat } from '../../../Utility/utils/coordinatesUtils';
import { ShipPlacementView } from './ShipPlacementView';
import { SHIP_EVENTS } from '../events/shipEvents';

export const ShipPlacementController = ({ model, view, publisher, componentEmitter }) => {
  const placementView = ShipPlacementView(view.elements.mainShip);

  const request = () => {
    console.log(model.getScopedID());
    publisher.request(SHIP_EVENTS.PLACEMENT.REQUESTED, {
      id: model.getID(),
      scopedID: model.getScopedID(),
      length: model.getLength()
    });
  };
  const place = ({ data }) => {
    const { placedCoordinates } = data;
    const internal = placedCoordinates.map((coordinates) => convertToInternalFormat(coordinates));
    model.setPlacedCoordinates({ internal, display: placedCoordinates });
    model.setIsPlaced(true);
    placementView.update.placementStatus(true);
    publisher.scoped.noFulfill(SHIP_EVENTS.PLACEMENT.SET, { scopedID: model.getScopedID() });
    componentEmitter.publish(SHIP_EVENTS.PLACEMENT.SET);
  };
  const pickup = () => {
    model.clearPlacedCoordinates();
    model.setIsPlaced(false);
    placementView.update.placementStatus(false);
  };

  const initialize = ({ data }) => {
    const { container } = data;
    placementView.initialize({
      placementContainer: container,
      requestPlacementCallback: request
    });
  };

  componentEmitter.subscribe(SHIP_EVENTS.SELECTION.SELECTED, placementView.enableRequest);
  componentEmitter.subscribe(SHIP_EVENTS.SELECTION.DESELECTED, placementView.disableRequest);
  componentEmitter.subscribe(SHIP_EVENTS.PLACEMENT.PICKUP_REQUESTED, pickup);
  componentEmitter.subscribe(SHIP_EVENTS.PLACEMENT.CONTAINER_CREATED, initialize);
  componentEmitter.subscribe(SHIP_EVENTS.PLACEMENT.OVER, placementView.end);
  componentEmitter.subscribe(SHIP_EVENTS.PLACEMENT.PLACEMENT_COORDINATES_RECEIVED, place);
};
