import { createSlug, cleanText } from './stringUtils';

export const createIdentity = ({ scope, name }) => {
  const slug = createSlug(name);
  const cleanScope = cleanText(scope);
  return {
    id: slug,
    scopedID: `${cleanScope}#${slug}`,
    scope: cleanScope,
    name: cleanText(name)
  };
};
