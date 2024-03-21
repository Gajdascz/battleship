/**
 * Initializes a ManagerFactor for lazy-loading and accessing component managers.
 *
 * @param {Object} detail Manager details.
 * @param {Object} ManagerBuilder Function to initialize Manager.
 * @param {Object} initialDetails Data required to build the manager passed as arguments to the builder.
 * @param {Object} validateDetails Function to validate details for manager initialization.
 * @returns {Object} Interface for loading and accessing manager.
 */
export const ManagerFactory = ({ ManagerBuilder, initialDetails, validateDetails }) => {
  let details = initialDetails;
  let manager = null;
  const setDetails = (newDetails) => {
    if (manager) manager.end();
    details = newDetails;
    manager = ManagerBuilder(details);
  };
  const initialize = () => {
    if (!validateDetails(details)) {
      throw new Error(`Cannot initialize manager with invalid details.`);
    }
    if (manager) manager.end();
    manager = ManagerBuilder(details);
  };
  const getManager = () => {
    if (!manager) initialize();
    return manager;
  };
  const reset = () => {
    manager.end();
    details = null;
    manager = null;
  };
  return { getManager, setDetails, reset };
};
