import { SHIP_EVENTS, MAIN_GRID_EVENTS, GAME_EVENTS } from '../../../../Events/events';

export const BoardPlacementManager = ({ view, model, publisher, subscriptionManager }) => {
  const emit = {
    shipSelected: () =>
      publisher.scoped.noFulfill(MAIN_GRID_EVENTS.PLACEMENT.TOGGLE_PLACEMENT_SUBMISSION_REQUEST, {
        isReady: false
      }),
    shipPlaced: () =>
      publisher.scoped.noFulfill(MAIN_GRID_EVENTS.PLACEMENT.TOGGLE_PLACEMENT_SUBMISSION_REQUEST, {
        isReady: model.isAllShipsPlaced()
      }),
    placementFinalized: () => publisher.scoped.noFulfill(GAME_EVENTS.PLAYER_FINALIZED_PLACEMENT)
  };

  const onShipSelected = ({ data }) => {
    emit.shipSelected();
    view.buttons.rotateShip.update(data.scopedID);
  };
  const onShipPlaced = () => {
    emit.shipPlaced();
    view.buttons.rotateShip.clearWrapper();
  };
  const onPlacementsFinalized = () => {
    view.placement.end();
    subscriptionManager.scoped.unsubscribeMany(subscriptions);
    emit.placementFinalized();
  };
  const onInitialize = () => {
    view.placement.initialize();
    subscriptionManager.scoped.subscribeMany(subscriptions);
  };

  const onTurnStart = () => {
    view.placement.onTurnStart();
  };

  const subscriptions = [
    { event: GAME_EVENTS.PLAYER_TURN, callback: onTurnStart },
    { event: SHIP_EVENTS.PLACEMENT.SET, callback: onShipPlaced },
    { event: SHIP_EVENTS.SELECTION.SELECTED, callback: onShipSelected },
    { event: MAIN_GRID_EVENTS.PLACEMENT.FINALIZED, callback: onPlacementsFinalized }
  ];
  return {
    initialize: () => onInitialize(),
    end: () => onPlacementsFinalized()
  };
};
