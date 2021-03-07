import {
  ConstantTypes,
  ScalarConstant,
} from '../types/config';

// eslint-disable-next-line import/prefer-default-export
export const divider: ScalarConstant = {
  type: ConstantTypes.SCALAR,
  size: 'U08',
  offset: 25,
  units: '',
  scale: 1,
  transform: 0,
  min: 1,
  max: 8,
  digits: 0,
};
