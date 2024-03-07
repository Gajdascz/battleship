// Board Component
import { BoardModel } from './main/model/BoardModel';
import { BoardPlacementManager } from './features/placement/BoardPlacementManager';
import { BoardCombatManager } from './features/combat/BoardCombatManager';
import { BoardView } from './main/view/BoardView';
import { BOARD_COMBAT_EVENTS, BOARD_PLACEMENT_EVENTS } from './common/boardEvents';
// External
import { EventEmitter } from '../../Events/core/EventEmitter';

export const BoardController = ({
  playerId,
  playerName,
  controllers,
  gameMode,
  displayContainer
}) => {
  const { fleet, mainGrid, trackingGrid } = controllers;
  const componentEmitter = EventEmitter();
  const { subscribe, publish, unsubscribe } = componentEmitter;
  const viewParameters = {
    playerId,
    playerName,
    container: displayContainer,
    gameMode,
    views: {
      mainGrid: mainGrid.view,
      trackingGrid: trackingGrid.view,
      fleet: fleet.view
    }
  };
  const view = BoardView(viewParameters);

  const placement = {
    isOver: false,
    endCallbacks: [],
    onEnd: (callback) => placement.endCallbacks.push(callback),
    startTurn: () => {
      BoardPlacementManager({
        placementView: view.placement,
        placementManagers: {
          fleet: fleet.getPlacementManager(),
          mainGrid: mainGrid.placementManager
        },
        componentEmitter
      });
      placement.isOver = false;
      publish(BOARD_PLACEMENT_EVENTS.START);
      subscribe(BOARD_PLACEMENT_EVENTS.END, placement.end);
    },
    end: () => {
      placement.isOver = true;
      placement.endCallbacks.forEach((callback) => callback());
      unsubscribe(BOARD_PLACEMENT_EVENTS.END, placement.end);
    }
  };

  const combat = {
    initialize: () => {
      BoardCombatManager({
        combatView: view.combat,
        componentEmitter,
        combatControllers: {
          fleet: fleet.combat,
          mainGrid: mainGrid.combat,
          trackingGrid: trackingGrid.combat
        }
      });
      subscribe(BOARD_COMBAT_EVENTS.END, combat.end);
    },
    endCallbacks: [],
    onEnd: (callback) => combat.endCallbacks.push(callback),

    handleIncomingAttack: (coordinates) =>
      publish(BOARD_COMBAT_EVENTS.INCOMING_ATTACK, coordinates),
    handleSentAttackResult: (result) => publish(BOARD_COMBAT_EVENTS.SENT_ATTACK_PROCESSED, result),
    onIncomingAttackProcessed: (callback) =>
      subscribe(BOARD_COMBAT_EVENTS.INCOMING_ATTACK_PROCESSED, callback),
    offIncomingAttackProcessed: (callback) =>
      unsubscribe(BOARD_COMBAT_EVENTS.INCOMING_ATTACK_PROCESSED, callback),
    onAttackSent: (callback) => subscribe(BOARD_COMBAT_EVENTS.ATTACK_SENT, callback),
    offAttackSend: (callback) => unsubscribe(BOARD_COMBAT_EVENTS.ATTACK_SENT, callback),
    startTurn: () => {
      publish(BOARD_COMBAT_EVENTS.START);
    },
    end: () => {
      combat.endCallbacks.forEach((callback) => callback());
      unsubscribe(BOARD_COMBAT_EVENTS.END, combat.end);
    }
  };

  return {
    getId: () => playerId(),
    placement: {
      onEnd: (callback) => placement.onEnd(callback),
      startTurn: () => placement.startTurn(),
      isOver: () => placement.isOver
    },
    combat: {
      initialize: () => combat.initialize(),
      onEnd: (callback) => combat.onEnd(callback),
      offEnd: () => combat.offEnd(),
      startTurn: () => combat.startTurn(),
      handleIncomingAttack: (coordinates) => combat.handleIncomingAttack(coordinates),
      onIncomingAttackProcessed: (callback) => combat.onIncomingAttackProcessed(callback),
      offIncomingAttackProcessed: (callback) => combat.offIncomingAttackProcessed(callback),
      onAttackSent: (callback) => combat.onAttackSent(callback),
      offAttackSent: (callback) => combat.offAttackSend(callback)
    },
    view
  };
};
