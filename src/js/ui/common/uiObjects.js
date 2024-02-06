import { ELEMENT_TYPES } from './uiConstants';

/**
 * @module basicUIObjects.js
 * Provides basic Object structures for common HTML elements.
 */

const btnObj = (btnTxt, attributes = {}) => ({
  type: ELEMENT_TYPES.BUTTON,
  text: btnTxt,
  attributes
});

const divObj = (attributes = {}, children) => ({
  type: ELEMENT_TYPES.DIV,
  attributes,
  children
});

const paragraphObj = (text, attributes = {}) => ({
  type: ELEMENT_TYPES.PARAGRAPH,
  text,
  attributes
});

const spanObj = (text, attributes = {}) => ({
  type: ELEMENT_TYPES.SPAN,
  text,
  attributes
});

const listObj = ({ type = 'ul', header = '', entries = '', attributes = {} }) => ({
  type,
  text: header,
  attributes,
  children: entries.map((entry) => ({ type: 'li', text: entry }))
});

const headerObj = ({ level = '1', text = '', attributes = {} }) => ({
  type: `h${level}`,
  text,
  attributes
});

export { btnObj, divObj, paragraphObj, spanObj, listObj, headerObj };
