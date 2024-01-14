import { buildElementTree } from '../../utility/elementObjBuilder';

const buildBasicUIObject = ({ type = 'div', text = '', attributes = {}, children } = {}) => {
  return {
    type,
    text,
    attributes,
    children
  };
};

export default function buildBasicUIElement({ type = 'div', text = '', attributes = {}, children } = {}) {
  return buildElementTree(buildBasicUIObject({ type, text, attributes, children }));
}
