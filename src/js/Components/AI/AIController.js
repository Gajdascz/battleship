// import addBaseAILogic from './ai/base/BaseAICore';
// import addIntermediateLogic from './ai/intermediate/IntermediateAICore';
// import addAdvancedLogic from './ai/advanced/AdvancedAICore';
import { AIModel } from './model/AIModel';
import { AIMainGridModel } from './components/MainGrid/AIMainGridModel';
import { AITrackingGridModel } from './components/TrackingGrid/AITrackingGridModel';
import { AIFleetModel } from './components/Fleet/AIFleetModel';
import { AIShipModel } from './components/Ship/AIShipModel';
import { AI_NAMES, STATUSES } from './common/constants';

import { PlacementManager } from './PlacementManager';
import { AIView } from './AIView';
import { EventManager } from '../../Events/management/EventManager';
import { GameStateManager } from '../../State/GameStateManager';
import { GAME_EVENTS } from '../Game/common/gameEvents';
import stateManagerRegistry from '../../State/stateManagerRegistry';

export const AIController = ({ difficulty, boardSettings, shipData }) => {
  const mainGridModel = AIMainGridModel(boardSettings.numberOfRows, boardSettings.numberOfCols);
  const trackingGridModel = AITrackingGridModel(
    boardSettings.numberOfRows,
    boardSettings.numberOfCols
  );
  const fleetModel = AIFleetModel();
  const shipNames = [];
  shipData.forEach((ship) => {
    const shipModel = AIShipModel(ship.length, ship.name);
    fleetModel.addMainShip(shipModel);
    fleetModel.addTrackingShip(shipModel.getID(), ship.length);
    shipNames.push(shipModel.getName());
  });
  const model = AIModel({
    aiName: AI_NAMES[difficulty],
    difficulty,
    fleetModel,
    mainGridModel,
    trackingGridModel
  });
  const view = AIView(boardSettings, model.properties.getName(), shipNames);
  const placementManager = PlacementManager(model.mainGrid.get());
  const { publisher, subscriptionManager } = EventManager(model.properties.getID());
  const stateManager = GameStateManager(model.properties.getID());
  /**
   * Randomly places the AI's fleet onto it's board's main grid.
   * @returns {void}
   */
  const placeShips = () => {
    const placements = placementManager.calculateRandomShipPlacements(model.fleet.getData());
    placements.forEach(({ id, placement }) => {
      model.mainGrid.place(placement[0], placement[placement.length - 1]);
      model.fleet.setShipPlacementCoordinates(id, placement);
    });
  };
  const getAttackStrategy = () => model.moves.getRandomMove;

  const sendAttack = getAttackStrategy();

  const placement = {
    onTurn: () => {
      placeShips();
      publisher.scoped.noFulfill(GAME_EVENTS.PLAYER_FINALIZED_PLACEMENT);
    },
    init: () => {
      subscriptionManager.scoped.subscribe(GAME_EVENTS.PLAYER_TURN, placement.onTurn);
    },
    end: () => {
      subscriptionManager.scoped.unsubscribe(GAME_EVENTS.PLAYER_TURN, placement.onTurn);
    }
  };
  stateManager.setFunctions.placement({ enterFns: placement.init, exitFns: placement.end });

  return {
    get isAI() {
      return model.properties.isAI();
    },
    getID: () => model.properties.getID(),
    getName: () => model.properties.getName(),

    getView: () => view,
    isAllShipsPlaced: () => model.fleet.isAllShipsPlaced(),
    isAllShipsSunk: () => model.fleet.isAllShipsSunk(),
    sendAttack,
    initializeStateManagement: () => stateManagerRegistry.registerManager(stateManager)
  };
};
