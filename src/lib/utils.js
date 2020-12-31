export const camelToSnakeCase = (str) => str
  .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const camelToUrlCase = (str) => str
  .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

export const snakeToCamelCase = (str) => str
  .replace(/([-_]\w)/g, (g) => g[1].toUpperCase());
