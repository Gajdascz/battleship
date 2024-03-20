import { validateCoordinates } from '../../../../../../../Utility/utils/validationUtils';
/**
 * Initializes a HitsManagerFactory for managing hit data in a game of Battleship.
 * Tracks hits and sunken ships, providing methods to record, resolve, and query this data.
 *
 * @returns {object} Object encapsulating hit management functionality.
 */
export const HitsManager = () => {
  let lastHit = null;
  let totalHits = 0;
  let totalSunk = 0;
  const unresolvedHits = new Set();
  const resolvedHits = new Set();

  /**
   * Converts a coordinate pair [x,y] into a string key 'x,y' to be used as unique identifiers.
   * Used to efficiently store and retrieve coordinates in Sets.
   *
   * @param {array[integer]} hit Coordinate pair ([x,y] format) to be converted.
   * @returns {string|null} String key or null if coordinates are invalid.
   */
  const hitKey = (hit) => {
    try {
      validateCoordinates(hit);
      return `${hit[0]},${hit[1]}`;
    } catch (error) {
      console.error(`Invalid Hit Coordinates In HitsManager: ${error.message}`);
      return null;
    }
  };
  /**
   * Transforms a Set of coordinate keys into an array of coordinate pairs [x,y] for processing.
   *
   * @param {Set} set Set Object to convert.
   * @returns {array[array[integer]]} Array of coordinates.
   */
  const setToArray = (set) => [...set].map((key) => key.split(',').map(Number));

  /**
   * Determines whether a given hit has been resolved (associated with a sunken ship).
   *
   * @param {array[integer]} hit Coordinate pair to check.
   * @returns {boolean} True if hit is resolved, false otherwise.
   */
  const isHitResolved = (hit) => resolvedHits.has(hitKey(hit));

  /**
   * Stores the coordinates of an unresolved hit (not associated with a sunken ship).
   *
   * @param {array[integer]} hit Coordinate pair representing hit cell.
   * @returns {void}
   */
  const addUnresolvedHit = (hit) => {
    console.log(`addUnresolved: ${hit}`);
    const key = hitKey(hit);
    if (key && !unresolvedHits.has(key) && !resolvedHits.has(key)) unresolvedHits.add(key);
  };

  /**
   * Marks a hit as resolved (linked to a sunken ship) and removes it from the unresolved set.
   * Can process either a new hit (array) or an existing unresolved hit (string key).
   *
   * @param {array[integer]} hit Coordinate pair representing hit cell.
   * @returns {void}
   */
  const resolveHit = (hit) => {
    const matchKey = /^\d+,\d+$/;
    let key;
    if (typeof hit === 'string' && matchKey.test(hit)) key = hit;
    else if (Array.isArray(hit)) key = hitKey(hit);
    if (key && unresolvedHits.has(key)) {
      unresolvedHits.delete(key);
      resolvedHits.add(key);
    }
  };

  /**
   * Evaluates if the total number of hits equals the total length of sunken ships.
   * Indicates whether all current hits have been resolved.
   *
   * @returns {boolean} True if hits are equal to sunk, false otherwise.
   */
  const areHitsEqualToSunk = () => totalHits === totalSunk;

  const resolveAllUnresolved = () => [...unresolvedHits].forEach(resolveHit);
  const getUnresolvedHits = () => setToArray(unresolvedHits);
  const getResolvedHits = () => setToArray(resolvedHits);

  const setLastHit = (hit) => (lastHit = hit);
  const getLastHit = () => lastHit;

  const addHit = () => totalHits++;
  const getHits = () => totalHits;

  const addSunk = (sunkShipLength) => (totalSunk += sunkShipLength);
  const getSunk = () => totalSunk;

  return {
    resolveHit,
    resolveAllUnresolved,
    isHitResolved,
    addUnresolvedHit,
    setLastHit,
    getLastHit,
    addHit,
    addSunk,
    getHits,
    getSunk,
    areHitsEqualToSunk,
    getResolvedHits,
    getUnresolvedHits,
    hasUnresolvedHits: () => unresolvedHits.size > 0
  };
};
