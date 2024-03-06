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

  return {
    getId: () => playerId(),
    placement: {
      onEnd: (callback) => componentEmitter.subscribe(BOARD_PLACEMENT_EVENTS.END, callback),
      offEnd: (callback) => componentEmitter.unsubscribe(BOARD_PLACEMENT_EVENTS.END, callback),
      startTurn: () => {
        BoardPlacementManager({
          placementView: view.placement,
          placementControllers: { fleet: fleet.placement, mainGrid: mainGrid.placement },
          componentEmitter
        });
        componentEmitter.publish(BOARD_PLACEMENT_EVENTS.START);
      }
    },
    combat: {
      initialize: ({
        opponentProcessIncomingAttack,
        opponentOnIncomingAttackProcessed,
        opponentOnAttackSent
      }) => {
        BoardCombatManager({
          combatView: view.combat,
          componentEmitter,
          combatControllers: {
            fleet: fleet.combat,
            mainGrid: mainGrid.combat,
            trackingGrid: trackingGrid.combat
          },
          opponentProcessIncomingAttack,
          opponentOnIncomingAttackProcessed,
          opponentOnAttackSent
        });
      },
      onEnd: (callback) => {},
      offEnd: (callback) => {},
      startTurn: () => {
        componentEmitter.publish(BOARD_COMBAT_EVENTS.START);
      }
    },
    view
  };
};
