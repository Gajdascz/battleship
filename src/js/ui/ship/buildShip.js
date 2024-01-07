import { buildElementTree } from '../utility-ui/elementObjBuilder';

export default function buildShip(length, name, elementType, orientation = 'vertical') {
  let shipObj;
  const classAttr = name.toLowerCase().replace(' ', '-');
  const dataNameAttr = name.toLowerCase().replace(' ', '-');
  if (elementType === 'div') {
    shipObj = {
      type: elementType,
      attributes: {
        class: `${classAttr} fleet-entry`,
        'data-sunk': false,
        'data-name': dataNameAttr
      },
      children: [
        {
          type: 'p',
          text: name,
          attributes: {
            class: 'ship-name'
          }
        }
      ]
    };
  } else if (elementType === 'button') {
    shipObj = {
      type: elementType,
      attributes: {
        class: `${classAttr} fleet-entry`,
        'data-length': `${length}`,
        'data-orientation': `${orientation}`,
        'data-placed': false,
        'data-sunk': false,
        'data-name': dataNameAttr
      },
      children: [
        {
          type: 'p',
          text: name,
          attributes: {
            class: 'ship-name'
          }
        },
        {
          type: 'p',
          text: length,
          attributes: { class: 'ship-length' }
        }
      ]
    };
  }
  const shipElement = buildElementTree(shipObj);
  if (elementType === 'button') {
    shipElement.addEventListener('click', function (e) {
      const event = new CustomEvent('shipSelected', {
        detail: { element: shipElement, length, name: dataNameAttr, orientation }
      });
      document.dispatchEvent(event);
    });
  }
  return shipElement;
}
