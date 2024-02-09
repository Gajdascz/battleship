/*
  Reference: Slug refers to a URL-friendly representation of a string,
  originating from printing and publishing where it denoted a piece of
  type metal used for spacing between lines of text to ensure proper alignment.
*/
/**
 * Creates a URL-friendly representation of a string.
 *
 * @param {string} text Text to convert.
 * @returns {string | null} Converted text.
 *
 */
const createSlug = (text) => (text ? text.toLowerCase().replaceAll(/ /g, '-') : null);
/**
 * Converts a numerical index to its corresponding alphabet letter (starting from 'A').
 *
 * @param {number} num The numerical index to convert.
 * @return {string} The corresponding alphabet letter.
 */
const A_CHARACTER_CODE = 65;
const convertIndexToLetter = (index) => String.fromCharCode(A_CHARACTER_CODE + index);
/**
 * Converts a character string to its corresponding index value.
 *
 * @param {string} num The character string to convert.
 * @return {num} The corresponding index number.
 */
const convertLetterToIndex = (letter) => letter.charCodeAt() - A_CHARACTER_CODE;

export { createSlug, convertIndexToLetter, convertLetterToIndex };
