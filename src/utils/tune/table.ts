export const parseValues = (values: string) => values
  .split('\n')
  .map((val) => val.trim())
  .filter((val) => val !== '')
  .map(Number);

export const todo = '';
