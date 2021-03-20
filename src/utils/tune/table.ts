export const parseXy = (value: string) => value
  .trim()
  .split('\n')
  .map((val) => val.trim())
  .filter((val) => val !== '')
  .map(Number);

export const parseZ = (value: string) => value
  .trim()
  .split('\n')
  .map((val) => val.trim().split(' ').map(Number));
