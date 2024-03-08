export const createEventKeyGenerator = (scope) => {
  if (!scope) throw new Error(`Scope not set.`);
  return (event) => `${scope}@${event}`;
};
