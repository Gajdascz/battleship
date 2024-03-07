// import addBaseAILogic from './ai/base/BaseAICore';
// import addIntermediateLogic from './ai/intermediate/IntermediateAICore';
// import addAdvancedLogic from './ai/advanced/AdvancedAICore';
import { AIModel } from './model/AIModel';
import { AIMainGridModel } from './components/MainGrid/AIMainGridModel';
import { AITrackingGridModel } from './components/TrackingGrid/AITrackingGridModel';
import { AIFleetModel } from './components/Fleet/AIFleetModel';
import { AIShipModel } from './components/Ship/AIShipModel';
import { AI_NAMES, STATUSES } from './common/constants';

import { PlacementCoordinatesGenerator } from './features/placement/PlacementCoordinatesGenerator';
import { AIView } from './AIView';
import { GameStateManager } from '../../State/GameStateManager';
import { EventEmitter } from '../../Events/core/EventEmitter';
import { AI_COMBAT_EVENTS, AI_PLACEMENT_EVENTS } from './common/aiEvents';
import { PlacementManager } from './features/placement/PlacementManager';
import { CombatManager } from './features/combat/CombatManager';

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
  const componentEmitter = EventEmitter();
  const placementGenerator = PlacementCoordinatesGenerator(model.mainGrid.get());
  /**
   * Randomly places the AI's fleet onto it's board's main grid.
   * @returns {void}
   */
  const placeShips = () => {
    const placements = placementGenerator.calculateRandomShipPlacements(model.fleet.getData());
    placements.forEach(({ id, placement }) => {
      model.mainGrid.place(id, placement[0], placement[placement.length - 1]);
      model.fleet.setShipPlacementCoordinates(id, placement);
    });
  };
  const getAttackStrategy = () => model.moves.getRandomMove;

  const sendAttack = getAttackStrategy();

  const { publish, subscribe, unsubscribe } = componentEmitter;

  const placement = {
    isOver: false,
    endCallbacks: [],
    onOver: () => (placeShips.isOver = true),
    onEnd: (callback) => subscribe(AI_PLACEMENT_EVENTS.SHIPS_PLACED, callback),
    offEnd: () =>
      placement.endCallbacks.forEach((callback) =>
        unsubscribe(AI_PLACEMENT_EVENTS.SHIPS_PLACED, callback)
      ),
    startTurn: () => {
      placement.isOver = false;
      PlacementManager(model, componentEmitter);
      publish(AI_PLACEMENT_EVENTS.PLACE_SHIPS);
      placement.onEnd(placement.onOver);
    }
  };

  const combat = {
    initialize: () => {
      CombatManager({
        model,
        componentEmitter
      });
      publish(AI_COMBAT_EVENTS.INITIALIZE);
    },
    endCallbacks: [],
    onEnd: (callback) => {
      combat.endCallbacks.push(callback);
      subscribe(AI_COMBAT_EVENTS.END, callback);
    },
    offEnd: () => {
      combat.endCallbacks.forEach((callback) => unsubscribe(AI_COMBAT_EVENTS.END, callback));
      combat.endCallbacks = [];
    },
    sendAttack: () => publish(AI_COMBAT_EVENTS.SEND_ATTACK),
    onAttackSent: (callback) => subscribe(AI_COMBAT_EVENTS.ATTACK_SENT, callback),
    offAttackSent: (callback) => unsubscribe(AI_COMBAT_EVENTS.ATTACK_SENT, callback),
    handleSentAttackResult: (result) =>
      publish(AI_COMBAT_EVENTS.PROCESS_SENT_ATTACK_RESULT, result),
    handleIncomingAttack: (coordinates) => publish(AI_COMBAT_EVENTS.INCOMING_ATTACK, coordinates),
    onIncomingAttackProcessed: (callback) =>
      subscribe(AI_COMBAT_EVENTS.INCOMING_ATTACK_PROCESSED, callback),
    offIncomingAttackProcessed: (callback) =>
      unsubscribe(AI_COMBAT_EVENTS.INCOMING_ATTACK_PROCESSED, callback)
  };

  return {
    getPlayerModel: () => model.properties,
    getId: () => model.getId(),
    board: {
      placement: {
        onEnd: (callback) => placement.onEnd(callback),
        offEnd: () => placement.offEnd(),
        startTurn: () => placement.startTurn,
        isOver: () => placement.isOver
      },
      combat: {
        initialize: () => {
          CombatManager({
            model,
            componentEmitter
          });
          publish(AI_COMBAT_EVENTS.INITIALIZE);
        },
        endCallbacks: [],
        onEnd: (callback) => {},
        offEnd: (callback) => {},
        sendAttack: () => publish(AI_COMBAT_EVENTS.SEND_ATTACK),
        onAttackSent: (callback) => subscribe(AI_COMBAT_EVENTS.ATTACK_SENT, callback),
        offAttackSent: (callback) => unsubscribe(AI_COMBAT_EVENTS.ATTACK_SENT, callback),
        handleSentAttackResult: (result) =>
          publish(AI_COMBAT_EVENTS.PROCESS_SENT_ATTACK_RESULT, result),
        handleIncomingAttack: (coordinates) =>
          publish(AI_COMBAT_EVENTS.INCOMING_ATTACK, coordinates),
        onIncomingAttackProcessed: (callback) =>
          subscribe(AI_COMBAT_EVENTS.INCOMING_ATTACK_PROCESSED, callback),
        offIncomingAttackProcessed: (callback) =>
          unsubscribe(AI_COMBAT_EVENTS.INCOMING_ATTACK_PROCESSED, callback)
      }
    },
    isAllShipsSunk: () => model.fleet.isAllShipsSunk(),
    sendAttack,
    view: {
      getTrackingGrid: () => view.trackingGrid.elements.getGrid(),
      getTrackingFleet: () => view.fleet.getTrackingFleet()
    }
  };
};
