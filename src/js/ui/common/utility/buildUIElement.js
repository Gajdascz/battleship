import { buildElementTree } from '../../../utility/elementObjBuilder';

/**
 * @module buildBasicUIElement.js
 * Helper functions for building and returning basic Objects to be built into HTML elements.
 * Centralizes the creation processes and helps with code clutter.
 */

const buildBasicUIObject = ({ type = 'div', text = '', attributes = {}, children } = {}) => ({
  type,
  text,
  attributes,
  children
});

export default function buildUIElement({
  type = 'div',
  text = '',
  attributes = {},
  children
} = {}) {
  return buildElementTree(buildBasicUIObject({ type, text, attributes, children }));
}
