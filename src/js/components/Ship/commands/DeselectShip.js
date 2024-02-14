export const DeselectShip = ({ setIsSelected, updateSelectedStatusView }) => {
  const _setIsSelected = setIsSelected;
  const _updateSelectedStatusView = updateSelectedStatusView;
  return {
    execute: () => {
      _setIsSelected(false);
      _updateSelectedStatusView(false);
    }
  };
};
