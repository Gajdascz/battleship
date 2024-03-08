// Board Component
import { BoardPlacementManager } from './features/placement/BoardPlacementManager';
import { BoardCombatManager } from './features/combat/BoardCombatManager';
import { BoardView } from './main/view/BoardView';
import { BOARD_COMBAT_EVENTS, BOARD_PLACEMENT_EVENTS } from './common/boardEvents';
import { createEventKeyGenerator } from '../../Utility/utils/createEventKeyGenerator';

export const BoardController = ({
  playerId,
  playerName,
  controllers,
  gameMode,
  displayContainer,
  gameEmitter
}) => {
  const { fleet, mainGrid, trackingGrid } = controllers;
  const { getKey } = createEventKeyGenerator(playerId);
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
    manager: null,
    hasStarted: false,
    onEnd: (callback) => placement.endCallbacks.push(callback),

    startTurn: () => {
      if (placement.hasStarted) return;
      placement.manager = BoardPlacementManager({
        placementView: view.placement,
        placementManagers: {
          fleet: fleet.getPlacementManager(),
          mainGrid: mainGrid.getPlacementManager()
        },
        gameEmitter
      });
      placement.hasStarted = true;
      placement.isOver = false;
      placement.manager.start();
      subscribe(BOARD_PLACEMENT_EVENTS.END, placement.end);
    },
    end: () => {
      placement.isOver = true;
      placement.endCallbacks.forEach((callback) => callback());
      unsubscribe(BOARD_PLACEMENT_EVENTS.END, placement.end);
    }
  };

  const combat = {
    start: () => {
      BoardCombatManager({
        combatView: view.combat,
        componentEmitter: emitter,
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
    getId: () => playerId,
    getPlayerName: () => playerName,
    acceptTrackingFleet: (fleet) => view.acceptTrackingFleet(fleet),
    provideTrackingFleet: () => view.provideTrackingFleet(),
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
