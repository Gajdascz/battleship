import { PUBLISHER_KEYS } from '../events/buildPublisher';
import { convertToInternalFormat } from '../../../utility/utils/coordinatesUtils';
import { ShipPlacementView } from './ShipPlacementView';
import { SHIP_EVENTS } from '../events/shipEvents';

export const ShipPlacementController = ({ model, view, publisher, componentEventEmitter }) => {
  const placementView = ShipPlacementView(view.elements.mainShip);

  const request = () => {
    console.log(model.getScopedID());
    publisher.request(PUBLISHER_KEYS.REQUESTS.PLACEMENT, {
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
    publisher.execute(PUBLISHER_KEYS.ACTIONS.PLACEMENT_SET, { scopedID: model.getScopedID() });
    componentEventEmitter.publish(SHIP_EVENTS.PLACEMENT.SET);
  };
  const pickup = () => {
    model.clearPlacedCoordinates();
    model.setIsPlaced(false);
    placementView.update.placementStatus(false);
  };

  return {
    initialize: ({ data }) => {
      const { container } = data;
      placementView.initialize({
        placementContainer: container,
        requestPlacementCallback: request
      });
    },
    request: {
      enable: () => placementView.enableRequest(),
      disable: () => placementView.disableRequest()
    },
    place,
    pickup,
    end: () => placementView.end()
  };
};
