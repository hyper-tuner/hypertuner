import {
  Constants as TuneConstantsType,
} from '../../types/tune';

import {
  Page as ConfigPageType,
} from '../../types/config';

export const isExpression = (val: any) => `${val}`.startsWith('{') && `${val}`.endsWith('}');

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
        val = (constant.values as string[]).indexOf(`${val}`);
      }

      // escape string values
      if (typeof val === 'string') {
        val = `'${val}'`;
      }

      return `const ${constName} = ${val};`;
  })
);

export const evaluateExpression = (expression: string, tuneConstants: TuneConstantsType, configPages: ConfigPageType[]) => {
  const constDeclarations = prepareConstDeclarations(tuneConstants, configPages);
  try {
    // TODO: strip eval from `command` etc
    // https://www.electronjs.org/docs/tutorial/security
    // eslint-disable-next-line no-eval
    return eval(`
      'use strict';
      ${constDeclarations.join('')}
      ${expression.slice(1).slice(0, -1).trim()};
    `);
  } catch (error) {
    console.info('Condition evaluation failed with:', error.message);
  }

  return undefined;
};
