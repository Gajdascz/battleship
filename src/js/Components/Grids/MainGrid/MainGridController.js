import { MainGridModel } from './main/model/MainGridModel';
import { MainGridView } from './main/view/MainGridView';
import { EventEmitter } from '../../../Events/core/EventEmitter';
import { PlacementManagerFactory } from './features/placement/MainGridPlacementManager';
import { EventHandler } from '../../../Events/management/EventHandler';
import { CombatManagerFactory } from './features/MainGridCombatManager';

export const MainGridController = (boardConfig) => {
  const { numberOfRows, numberOfCols, letterAxis } = boardConfig;
  const model = MainGridModel({ numberOfRows, numberOfCols, letterAxis });
  const view = MainGridView({ numberOfRows, numberOfCols, letterAxis });
  const emitter = EventEmitter();
  const createHandler = (eventName, callback = (args) => args) =>
    EventHandler(emitter, eventName, callback);

  const placementManager = PlacementManagerFactory({ model, view, createHandler });
  const getPlacementManager = () => placementManager.getManager();

  const combatManager = CombatManagerFactory({ model, view, createHandler });
  const getCombatManager = () => combatManager.getManager();

  return {
    getPlacementManager,
    getCombatManager,
    properties: {
      getDimensions: () => model.getDimensions()
    },
    view: {
      attachTo: (container) => view.attachTo(container),
      attachWithinWrapper: (element) => view.attachWithinWrapper(element),
      getGrid: () => view.elements.getGrid(),
      getWrapper: () => view.elements.getWrapper(),
      getSubmitButton: () => view.elements.getSubmitPlacementsButton(),
      hide: () => view.hide(),
      show: () => view.show(),
      enable: () => view.enable(),
      disable: () => view.disable()
    }
  };
};
