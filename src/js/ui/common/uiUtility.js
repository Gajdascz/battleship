import { buildElementTree } from '../../utility/elementObjBuilder';

/**
 * Converts a numerical index to its corresponding alphabet letter (starting from 'A').
 *
 * @param {number} num The numerical index to convert.
 * @return {string} The corresponding alphabet letter.
 */
const getLetter = (num) => String.fromCharCode(65 + num);

/**
 * Simplifies creation of UI object descriptions for buildElementTree.
 *
 * @param {string} type The type of the element (e.g., 'div', 'button').
 * @param {Object} options Options object containing attributes, text, and children.
 * @returns {Object} The object description for buildElementTree.
 */
const uiObj = (type, { attributes = {}, text = '', children = [], namespace = null } = {}) => ({
  type,
  attributes,
  text,
  children,
  namespace
});

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
) => buildElementTree(uiObj(type, { text, attributes, children }));

/**
 * Provides easy access to buildElementTree from this module for building uiObjs.
 *
 * @param {Object} uiObj Structured object to be built.
 * @returns {HTMLElement} Element created from object structure.
 */
const uiObjToElement = (uiObj) => buildElementTree(uiObj);

export { getLetter, uiObj, buildUIElement, uiObjToElement };
