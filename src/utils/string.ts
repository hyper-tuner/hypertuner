export const camelToSnakeCase = (str: string) => str
  .replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`);

export const camelToUrlCase = (str: string) => str
  .replace(/[A-Z]/g, (letter: string) => `-${letter.toLowerCase()}`);

export const snakeToCamelCase = (str: string) => str
  .replace(/([-_]\w)/g, (g) => g[1].toUpperCase());
