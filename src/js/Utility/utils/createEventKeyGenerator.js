export const createEventKeyGenerator = (scope) => ({
  getKey: (event) => {
    if (!scope) throw new Error(`Scope not set.`);
    return `${scope}@${event}`;
  }
});
