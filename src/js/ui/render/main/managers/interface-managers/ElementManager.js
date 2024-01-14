import { isHTMLElement, throwError } from '../ManagerUtilities';

export default function ElementManager() {
  const elementCache = new Map();

  /**
   * Checks if an element is cached under the provided selector key.
   * @param {string} key - Key used to identify element in cache.
   * @returns {boolean} - True if element is cached, false otherwise.
   */
  const isCached = (key) => elementCache.has(key);

  /**
   * Retrieves requested element from cache.
   * @param {string} key - Key used to identify element in cache.
   * @returns {HTMLElement|boolean} - Element if found, false if not in cache.
   */
  const getCachedElement = (key) => {
    if (isCached(key)) return elementCache.get(key);
    else return false;
  };

  /**
   * Stores element in Cache using selector as key.
   * @param {string} key - Key used to identify element in cache.
   * @param {HTMLElement|document} parent - Parent element or document reference to query.
   * @returns {boolean} - True if element is successfully cached, false otherwise.
   */
  const cacheElement = (key, element) => {
    if (!isHTMLElement(element)) throwError('element', 'Element', element);
    if (!isCached(key)) {
      elementCache.set(key, element);
      return true;
    }
    return false;
  };

  /**
   * Updates an element stored in cache.
   * @param {string} key - Key used to identify element in cache.
   * @param {HTMLElement} newElement - Element to store under selector key.
   * @returns {boolean} - True if updated, false otherwise.
   */
  const updateElementInCache = (key, newElement) => {
    if (!isHTMLElement(newElement)) throwError('newElement', 'Element', newElement);
    if (isCached(key)) {
      elementCache.set(key, newElement);
      return true;
    }
    return false;
  };

  /**
   * Removes element from cache.
   * @param {string} key - Key used to identify element in cache.
   * @returns {boolean} - True if element found and removed, false otherwise.
   */
  const removeElementInCache = (key) => {
    if (isCached(key)) return elementCache.delete(key);
  };

  return {
    cacheElement,
    getCachedElement,
    updateElementInCache,
    removeElementInCache,
    reset: () => elementCache.clear()
  };
}
