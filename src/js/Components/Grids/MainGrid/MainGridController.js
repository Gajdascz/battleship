import { MainGridModel } from './main/model/MainGridModel';
import { MainGridView } from './main/view/MainGridView';
import { EventEmitter } from '../../../Events/core/EventEmitter';
import { PlacementManagerFactory } from './features/placement/MainGridPlacementManager';
import { EventHandler } from '../../../Events/management/EventHandler';
import { convertToDisplayFormat } from '../../../Utility/utils/coordinatesUtils';
import { STATUSES } from '../../AI/common/constants';

export const MainGridController = (boardConfig) => {
  const { numberOfRows, numberOfCols, letterAxis } = boardConfig;
  const model = MainGridModel({ numberOfRows, numberOfCols, letterAxis });
  const view = MainGridView({ numberOfRows, numberOfCols, letterAxis });
  const emitter = EventEmitter();
  const createHandler = (eventName, callback = (args) => args) =>
    EventHandler(emitter, eventName, callback);
  const placementManager = PlacementManagerFactory({ model, view, createHandler });
  const getPlacementManager = () => placementManager.getManager();

  const processIncomingAttack = ({ data }) => {
    console.log(data);
    const cellData = model.processIncomingAttack(data);
    const [x, y] = data;
    const displayCoordinates = convertToDisplayFormat(x, y, model.getLetterAxis());
    if (cellData.value.status === STATUSES.HIT) view.displayShipHit(displayCoordinates);
    return cellData;
  };

  return {
    getPlacementManager,
    processIncomingAttack,
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
