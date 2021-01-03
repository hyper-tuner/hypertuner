import { Constants as TuneConstantsType } from '../types/tune';

export const camelToSnakeCase = (str: string) => str
  .replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`);

export const camelToUrlCase = (str: string) => str
  .replace(/[A-Z]/g, (letter: string) => `-${letter.toLowerCase()}`);

export const snakeToCamelCase = (str: string) => str
  .replace(/([-_]\w)/g, (g) => g[1].toUpperCase());

export const prepareConstDeclarations = (constants: TuneConstantsType) => (
  Object.keys(constants).map((constName: string) => {
      if (constName.includes('-')) {
        return null;
      }

      let val = constants[constName].value;

      if (typeof val === 'string' && val.includes('\n')) {
        return null;
      }

      if (typeof val === 'string') {
        val = `'${val}'`;
      }

      return `const ${constName} = ${val};`;
  })
);
