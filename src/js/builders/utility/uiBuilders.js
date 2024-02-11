import { buildElementTree } from './buildElementTree';

/**
 * Simplifies creation of UI object descriptions for buildElementTree.
 *
 * @param {string} type The type of the element (e.g., 'div', 'button').
 * @param {Object} options Options object containing attributes, text, and children.
 * @returns {Object} The object description for buildElementTree.
 */
const buildUIObj = (
  type,
  { attributes = {}, text = '', children = [], namespace = null } = {}
) => ({
  type,
  attributes,
  text,
  children,
  namespace
});

/**
 * Provides easy access to buildElementTree from this module for building uiObjs.
 *
 * @param {Object} uiObj Structured object to be built.
 * @returns {HTMLElement} Element created from object structure.
 */
const buildElementFromUIObj = (uiObj) => buildElementTree(uiObj);

/**
 * Wraps uiObj and buildElementTree to quickly create HTML Elements.
 *
 * @param {string} type The type of element to build (e.g., 'div', 'button').
 * @param {Object} options Options object containing attributes, text, and children.
 * @returns {HTMLElement} Built HTML Element.
 */
const buildUIElement = (
  type,
  { text = '', attributes = {}, children = [], namespace = null } = {}
) => buildElementTree(buildUIObj(type, { text, attributes, children, namespace }));

export { buildUIObj, buildUIElement, buildElementFromUIObj };
