import { GameStateController } from './GameStateController';
import { GAME_MODES, STATES } from '../../Utility/constants/common';
import { StartStateCoordinator } from './States/StartStateCoordinator';
import { PlacementStateCoordinator } from './States/PlacementStateCoordinator';
import { CombatStateCoordinator } from './States/CombatStateCoordinator';
import { dialogsManager } from './Managers/dialogsManager';

export const GameCoordinator = (() => {
  const { settings, gameOver, alternatePlayers } = dialogsManager;

  let turnManager = null;
  const players = {
    ids: null,
    controllers: null,
    controllerTypes: {
      PLACEMENT: 'placement',
      COMBAT: 'combat'
    },
    getControllersOfType: (type) =>
      Object.fromEntries(
        Object.entries(players.controllers).map(([id, controller]) => [id, controller[type]])
      ),
    getOpponentName: (playerId) => {
      const opponentId = players.ids.find((storedId) => playerId !== storedId);
      if (opponentId) return players.names[opponentId];
    },
    resetControllers: () => {
      Object.values(players.controllers).forEach((controller) => controller.reset());
    }
  };
  const events = {
    manager: null,
    methods: null,
    getters: {},
    setManager: (eventManager) => {
      if (events.manager) events.manager.reset();
      eventManager.manager = eventManager;
      events.methods = eventManager.getEventMethods();
      events.getters.getGlobal = eventManager.getGlobal;
      events.getters.getScoped = eventManager.getScoped;
      events.getters.getBaseTypes = eventManager.getBaseTypes;
    }
  };

  const { startGame, onEnter, onExit, transitionTo, exitCurrent } = GameStateController([
    STATES.START,
    STATES.PLACEMENT,
    STATES.PROGRESS,
    STATES.OVER
  ]);

  const stateManager = (() => {
    const sendStartRequest = () => startGame(STATES.START);
    const start = (() => {
      let coordinator = null;
      const enter = () => {
        if (!coordinator) {
          const startCoordinator = StartStateCoordinator();
          coordinator = startCoordinator;
          startCoordinator.init(settings.getCurrentSettings());
        }
        const { getPlayerData, getEventManager, getTurnManager } = coordinator;
        Object.assign(players, { ...getPlayerData() });
        events.setManager(getEventManager());
        turnManager = getTurnManager();
        turnManager.autoAlternate.enable();
        if (players.gameMode === GAME_MODES.HvH) {
          const onTurnEndManagers = turnManager.allPlayers.onTurnEndManagers;
          const dialog = alternatePlayers.getDialog();
          players.ids.forEach((playerId) => {
            const opponentName = players.getOpponentName(playerId);
            const endTurnHandler = () => dialog.display(opponentName);
            onTurnEndManagers[playerId].set(endTurnHandler);
          });
        }
        transitionTo(STATES.PLACEMENT);
      };
      const exit = () => {
        coordinator.reset();
        coordinator = null;
      };
      return { enter, exit };
    })();
    const placement = (() => {
      let coordinator = null;
      const transition = () => transitionTo(STATES.PROGRESS);
      const enter = () => {
        if (!coordinator) {
          coordinator = PlacementStateCoordinator({
            endCurrentPlayerTurn: turnManager.currentPlayer.endTurn,
            getCurrentPlayerId: turnManager.currentPlayer.getId,
            playerIds: players.ids,
            placementControllers: players.getControllersOfType(players.controllerTypes.PLACEMENT),
            eventMethods: events.methods,
            eventGetters: events.getters,
            transition
          });
        }
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
        const winnerId = players.ids.find((playerId) => playerId !== loserId);
        if (winnerId) return players.names[winnerId];
      };
      const transition = ({ data }) => {
        const { id } = data;
        const winner = getWinnerName(id);
        gameOver.setWinnerName(winner);
        transitionTo(STATES.OVER);
      };
      const toggleOverListener = (on = false) => {
        if (on) events.methods.on(overEvent, transition);
        else events.methods.off(overEvent, transition);
      };
      const enter = () => {
        if (!coordinator) {
          overEvent = events.getters.getGlobal().PLAYER_LOST;
          coordinator = CombatStateCoordinator({
            eventMethods: events.methods,
            eventGetters: events.getters,
            combatControllers: players.getControllersOfType(players.controllerTypes.COMBAT),
            playerIds: players.ids,
            currentPlayerId: turnManager.currentPlayer.getId(),
            endTurnMethods: turnManager.allPlayers.getAllPlayerEndTurnMethods(),
            onTurnStartManagers: turnManager.allPlayers.onTurnStartManagers,
            overEvent,
            gameMode: players.gameMode
          });
        }
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
        const onPlayAgain = () => {
          players.resetControllers();
          sendStartRequest();
        };
        gameOver.setOnPlayAgain(onPlayAgain);
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
