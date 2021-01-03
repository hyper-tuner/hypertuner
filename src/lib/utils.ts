import {
  Constants as TuneConstantsType,
} from '../types/tune';

import {
  Page as ConfigPageType,
} from '../types/config';

export const camelToSnakeCase = (str: string) => str
  .replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`);

export const camelToUrlCase = (str: string) => str
  .replace(/[A-Z]/g, (letter: string) => `-${letter.toLowerCase()}`);

export const snakeToCamelCase = (str: string) => str
  .replace(/([-_]\w)/g, (g) => g[1].toUpperCase());

export const prepareConstDeclarations = (tuneConstants: TuneConstantsType, configPages: ConfigPageType[]) => (
  Object.keys(tuneConstants).map((constName: string) => {
      if (constName.includes('-')) {
        return null;
      }

      let val = tuneConstants[constName].value;

      // TODO: skip 2D and 3D maps for now
      if (typeof val === 'string' && val.includes('\n')) {
        return null;
      }

      // TODO: check whether we can limit this to a single page
      const constant = configPages
        .find((page: ConfigPageType) => constName in page.data)
        ?.data[constName];

      // we need array index instead of a display value
      if (constant?.type === 'bits') {
        val = constant.values.indexOf(`${val}`);
      }

      // escape string values
      if (typeof val === 'string') {
        val = `'${val}'`;
      }

      return `const ${constName} = ${val};`;
  })
);
