/**
 * General attributes commonly used for DOM element manipulation.
 */
export const GENERAL_ATTRIBUTES = {
  ID: 'id',
  CLASS: 'class',
  TITLE: 'title',
  TYPE: 'type',
  HREF: 'href',
  DATA: (type) => `data-${type}` // Function to generate data-* attributes
};

/**
 * Specific attributes for input elements.
 */
export const INPUT_ATTRIBUTES = {
  VALUE: 'value',
  DISABLED: 'disabled',
  PLACEHOLDER: 'placeholder',
  MIN: 'min',
  MAX: 'max'
};

/**
 * Constants for string representations of boolean values,
 * primarily used for setting data attributes in HTML.
 */
export const BOOL = {
  T: 'true',
  F: 'false'
};
