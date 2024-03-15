import { globalEmitter } from '../../../Events/core/EventEmitter';
import { EventManager } from '../../../Events/management/EventManager';
import { GameStateController } from '../GameStateController';
import { PLAYERS, GAME_MODES, STATES } from '../../../Utility/constants/common';
import { initializePlayer } from './initializePlayer';
import { DEFAULT_FLEET } from '../../Fleet/common/fleetConstants';
import { configureBoardControllers } from './PlayerBoardConfigurator';
import { TurnManager } from './TurnManager';
import { CombatManager } from './CombatManager';
import { GameOverDialogView } from '../../Dialogs/GameOverDialog/GameOverDialogView';
import { StartState } from '../States/StartState';
import { PlacementState } from '../States/PlacementState';

export const GameCoordinator = (startGameEvent) => {
  let gameSettingsData = null;
  let turnManager = null;
  const players = {
    ids: null,
    controllers: null
  };
  const events = {
    manager: null,
    methods: null,
    getters: {},
    setManager: (eventManager) => {
      eventManager.manager = eventManager;
      events.methods = eventManager.getEventMethods();
      events.getters.getGlobal = eventManager.getGlobal;
      events.getters.getScoped = eventManager.getScoped;
      events.getters.getBaseTypes = eventManager.getBaseTypes;
    }
  };

  const stateController = GameStateController([
    STATES.START,
    STATES.PLACEMENT,
    STATES.PROGRESS,
    STATES.OVER
  ]);

  const states = {
    start: null,
    placement: null,
    combat: null,
    over: null
  };
  const stateMethods = {
    startGame: () => stateController.startGame(STATES.START),
    start: {
      enter: () => {
        if (!gameSettingsData) throw new Error(`Invalid Settings Data: ${gameSettingsData}`);
        states.start = StartState();
        states.start.init(gameSettingsData);
        const { getPlayerControllers, getPlayerIds, getEventManager, getTurnManager } =
          states.start;
        players.controllers = getPlayerControllers();
        players.ids = getPlayerIds();
        events.setManager(getEventManager());
        turnManager = getTurnManager();
        turnManager.autoAlternate.enable();
      },
      exit: () => {
        console.log('test');
        states.start.reset();
        states.start = null;
        stateController.transitionTo(STATES.PLACEMENT);
      }
    }
  };
  const initStateController = () => {
    stateController.onEnter(STATES.START, stateMethods.start.enter);
    stateController.onExit(STATES.START, stateMethods.start.exit);
    stateController.onEnter(STATES.PLACEMENT, placement.executeCurrent);
    stateController.onEnter(STATES.PROGRESS, combat.startState);
    stateController.onEnter(STATES.OVER, over.loadDialog);
    stateController.startGame(STATES.START);
  };

  const setGameSettingsData = (data) => {
    gameSettingsData = data;
    initStateController();
  };
  globalEmitter.subscribe(startGameEvent, setGameSettingsData);

  const placement = {
    finalized: {},
    onFinalize: ({ data }) => {
      placement.finalized[data] = true;
      turnManager.currentPlayer.endTurn();
      if (players.ids.every((id) => placement.finalized[id]))
        stateController.transitionTo(STATES.PROGRESS);
      else placement.executeCurrent();
    },
    setupFinalizeEvent: (id) => {
      const { on, off, emit } = events.methods;
      const { getScoped, getBaseTypes } = events.getters;
      const { FINALIZE_PLACEMENT } = getScoped(id, getBaseTypes().PLACEMENT);
      on(FINALIZE_PLACEMENT, placement.onFinalize);
      const finalizePlacement = () => {
        emit(FINALIZE_PLACEMENT, id);
        off(FINALIZE_PLACEMENT, placement.onFinalize);
      };
      return finalizePlacement;
    },
    executeCurrent: () => {
      const currentId = turnManager.currentPlayer.get();
      console.log(currentId);
      const onFinalize = placement.setupFinalizeEvent(currentId);
      players.controllers[currentId].placement.start(onFinalize);
    },
    reset: () => (placement.finalized = {})
  };
  const combat = {
    manager: null,
    lostEvent: null,
    playerCombatControllers: null,
    getPlayerCombatData: (id) => {
      const { getScoped, getBaseTypes } = events.getters;
      return {
        id,
        combatEvents: getScoped(id, getBaseTypes().COMBAT),
        handlers: players.controllers[id].combat.getHandlers()
      };
    },
    loadManager: () => {
      if (combat.manager) return;
      const [p1Id, p2Id] = players.ids;
      const { getGlobal } = events.getters;
      combat.manager = CombatManager({
        p1CombatData: combat.getPlayerCombatData(p1Id),
        p2CombatData: combat.getPlayerCombatData(p2Id),
        eventMethods: events.methods,
        lostEvent: getGlobal().PLAYER_LOST
      });
    },
    handlePlayerLost: ({ data }) => {},
    startState: () => {
      combat.playerCombatControllers = Object.entries(players.controllers).map(([key, value]) => ({
        key,
        controller: value.combat
      }));
      const { on } = events.methods;
      const { getGlobal } = events.getters;
      const endTurnMethods = turnManager.allPlayers.getAllPlayerEndTurnMethods();
      const onTurnStartMethodManagers = turnManager.allPlayers.onTurnStartManagers;
      combat.lostEvent = getGlobal().PROGRESS_OVER;
      combat.playerCombatControllers.forEach(({ key, controller }) => {
        controller.init();
        onTurnStartMethodManagers[key].set(controller.startTurn);
      });
      if (!combat.manager) combat.loadManager();
      combat.playerCombatControllers.forEach(({ key, controller }) =>
        controller.start({ sendEndTurn: endTurnMethods[key], ...combat.manager[key] })
      );
      on(combat.lostEvent, combat.handlePlayerLost);
      players.controllers[turnManager.currentPlayer.get()].combat.startTurn();
    },
    reset: () => {
      const { off } = events.methods;
      combat.manager.reset();
      combat.manager = null;
      combat.playerCombatControllers.forEach(({ key, controller }) => controller.end());
      off(combat.lostEvent, combat.handlePlayerLost);
    }
  };

  const over = {
    dialog: null,
    loadDialog: () => (over.dialog = GameOverDialogView(stateController.startGame(STATES.START))),
    displayResult: (name) => {}
  };
};
