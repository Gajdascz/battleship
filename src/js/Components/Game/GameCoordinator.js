import { GameStateController } from './GameStateController';
import { GAME_MODES, STATES } from '../../Utility/constants/common';
import { StartStateCoordinator } from './States/StartStateCoordinator';
import { PlacementStateCoordinator } from './States/PlacementStateCoordinator';
import { CombatStateCoordinator } from './States/CombatStateCoordinator';
import { dialogsManager } from '../Dialogs/dialogsManager';

/**
 * Coordinates game flow, transitioning between different states from start to end.
 */
export const GameCoordinator = (() => {
  const { settings, gameOver, alternatePlayers } = dialogsManager;
  const { getCurrentSettings } = settings;
  const managers = {
    turn: null,
    player: null,
    event: {
      manager: null,
      methods: null,
      getters: {},
      setManager: (eventManager) => {
        if (managers.event.manager) managers.event.manager.reset();
        managers.event.manager = eventManager;
        managers.event.methods = eventManager.getEventMethods();
        managers.event.getters.getGlobal = eventManager.getGlobal;
        managers.event.getters.getScoped = eventManager.getScoped;
        managers.event.getters.getBaseTypes = eventManager.getBaseTypes;
      }
    },
    reset: () => {
      managers.turn?.reset();
      managers.player?.reset();
      managers.event.manager?.reset();
      managers.turn = null;
      managers.player = null;
      managers.event.manager = null;
      managers.event.methods = null;
      managers.event.getters = {};
    }
  };

  const { startGame, onEnter, onExit, transitionTo } = GameStateController([
    STATES.START,
    STATES.PLACEMENT,
    STATES.PROGRESS,
    STATES.OVER
  ]);

  const stateManager = (() => {
    const sendStartRequest = () => {
      managers.reset();
      startGame(STATES.START);
    };
    const start = (() => {
      const enter = () => {
        const coordinator = StartStateCoordinator(getCurrentSettings());
        const { playerManager, eventManager, turnManager } = coordinator;
        managers.player = playerManager;
        managers.turn = turnManager;
        managers.event.setManager(eventManager);
        turnManager.autoAlternate.enable();
        const { gameMode, ids, getOpponentName } = managers.player;
        if (gameMode === GAME_MODES.HvH) {
          const onTurnEndManagers = turnManager.allPlayers.onTurnEndManagers;
          const dialog = alternatePlayers.getDialog();
          ids.forEach((playerId) => {
            const opponentName = getOpponentName(playerId);
            const endTurnHandler = () => dialog.display(opponentName);
            onTurnEndManagers[playerId].set(endTurnHandler);
          });
        }
        transitionTo(STATES.PLACEMENT);
      };
      const exit = () => {};
      return { enter, exit };
    })();
    const placement = (() => {
      let coordinator = null;
      const transition = () => transitionTo(STATES.PROGRESS);
      const enter = () => {
        if (coordinator) coordinator.reset();
        const { endTurn: endCurrentPlayerTurn, getId: getCurrentPlayerId } =
          managers.turn.currentPlayer;
        const { ids: playerIds, getControllersOfType, controllerTypes } = managers.player;
        const { methods: eventMethods, getters: eventGetters } = managers.event;
        const placementControllers = getControllersOfType(controllerTypes.PLACEMENT);
        coordinator = PlacementStateCoordinator({
          endCurrentPlayerTurn,
          getCurrentPlayerId,
          playerIds,
          placementControllers,
          eventMethods,
          eventGetters,
          transition
        });
        coordinator.start();
      };
      const exit = () => {
        coordinator.reset();
        coordinator = null;
      };
      return { enter, exit };
    })();

    const combat = (() => {
      let coordinator = null;
      let overEvent = null;
      const getWinnerName = (loserId) => {
        const { ids, getPlayerName } = managers.player;
        const winnerId = ids.find((playerId) => playerId !== loserId);
        if (winnerId) return getPlayerName(winnerId);
      };
      const transition = ({ data }) => {
        const { id } = data;
        const winner = getWinnerName(id);
        gameOver.setWinnerName(winner);
        transitionTo(STATES.OVER);
      };
      const toggleOverListener = (enable = false) => {
        if (!managers.event.methods) return;
        const { on, off } = managers.event.methods;
        if (enable) on(overEvent, transition);
        else off(overEvent, transition);
      };
      const enter = () => {
        if (coordinator) coordinator.reset();
        const { methods: eventMethods, getters: eventGetters } = managers.event;
        const { ids: playerIds, getControllersOfType, controllerTypes, gameMode } = managers.player;
        const combatControllers = getControllersOfType(controllerTypes.COMBAT);
        const { getAllPlayerEndTurnMethods, onTurnStartManagers } = managers.turn.allPlayers;
        const endTurnMethods = getAllPlayerEndTurnMethods();
        const currentPlayerId = managers.turn.currentPlayer.getId();
        overEvent = eventGetters.getGlobal().PLAYER_LOST;
        coordinator = CombatStateCoordinator({
          eventMethods,
          eventGetters,
          combatControllers,
          playerIds,
          currentPlayerId,
          endTurnMethods,
          onTurnStartManagers,
          overEvent,
          gameMode
        });
        coordinator.start();
        toggleOverListener(true);
      };
      const exit = () => {
        coordinator.reset();
        coordinator = null;
        toggleOverListener(false);
      };
      return { enter, exit };
    })();

    const over = (() => {
      const enter = () => {
        gameOver.setOnPlayAgain(sendStartRequest);
        gameOver.display();
      };
      return { enter };
    })();
    onEnter(STATES.START, start.enter);
    onExit(STATES.START, start.exit);
    onEnter(STATES.PLACEMENT, placement.enter);
    onExit(STATES.PLACEMENT, placement.exit);
    onEnter(STATES.PROGRESS, combat.enter);
    onExit(STATES.PROGRESS, combat.exit);
    onEnter(STATES.OVER, over.enter);
    return { startGame: sendStartRequest };
  })();

  settings.setOnSubmit(stateManager.startGame);
  settings.display();
})();
