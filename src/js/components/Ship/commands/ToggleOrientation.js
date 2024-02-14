import { publish } from '../utility/publishers';
import { KEY_EVENTS } from '../../../utility/constants/events';

export const ToggleOrientation = ({
  toggleFn,
  getOrientation,
  getLength,
  updateOrientationView
}) => {
  const _toggleFn = toggleFn;
  const _getOrientation = getOrientation;
  const _getLength = getLength;
  const _updateOrientationView = updateOrientationView;

  const isRotateRequest = (e) =>
    e.code === KEY_EVENTS.CODES.SPACE ||
    e.code === KEY_EVENTS.CODES.R ||
    e.button === 1 ||
    (e.target.classList.contains('rotate-ship-button') && e instanceof PointerEvent);

  return {
    execute: (e) => {
      if (!isRotateRequest(e)) return;
      e.preventDefault();
      _toggleFn();
      const orientation = _getOrientation();
      _updateOrientationView(orientation);
      publish.orientationToggled({
        length: _getLength(),
        orientation
      });
    }
  };
};
