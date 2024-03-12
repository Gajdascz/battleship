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
