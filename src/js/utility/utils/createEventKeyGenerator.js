const GLOBAL_KEY = 'global';
export const createEventKeyGenerator = (scope) => ({
  getKey: (event) => {
    if (!scope) throw new Error(`Scope not set.`);
    return `${scope}@${event}`;
  },
  getGlobalKey: (event) => `${GLOBAL_KEY}@${event}`,
  getGlobal: () => GLOBAL_KEY
});
