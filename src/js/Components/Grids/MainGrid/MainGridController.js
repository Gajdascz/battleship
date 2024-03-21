import { MainGridModel } from './main/model/MainGridModel';
import { MainGridView } from './main/view/MainGridView';
import { EventEmitter } from '../../../Events/core/EventEmitter';
import { PlacementManagerFactory } from './Managers/placement/MainGridPlacementManager';
import { EventHandler } from '../../../Events/management/EventHandler';
import { CombatManagerFactory } from './Managers/MainGridCombatManager';

/**
 * Initializes a MainGridController to manage main grid interactions.
 * The main grid is responsible for processing incoming attacks and managing ship placements.
 *
 * @param {Object} boardConfig Contains board configuration data
 * @returns {Object} Interface for interacting with Main Grid component.
 */
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
