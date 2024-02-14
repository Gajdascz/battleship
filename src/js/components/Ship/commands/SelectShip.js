import { publish } from '../utility/publishers';

export const SelectShip = ({ updateSelectedStatusView, getID, getLength, getOrientation }) => {
  const _updateSelectedStatusView = updateSelectedStatusView;
  const _getID = getID;
  const _getLength = getLength;
  const _getOrientation = getOrientation;
  return {
    execute: () => {
      _updateSelectedStatusView(true);
      publish.shipSelected({
        id: _getID(),
        length: _getLength(),
        orientation: _getOrientation()
      });
    },
    request: () => publish.selectRequested({ id: _getID() })
  };
};
