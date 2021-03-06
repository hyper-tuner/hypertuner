import {
  Config as ConfigType,
  Page as PageType,
  Constant,
} from '../../types/config';

export const findOnPage = (config: ConfigType, fieldName: string): Constant => {
  const foundPage = config
    .constants
    .pages
    .find((page: PageType) => fieldName in page.data) || { data: {} } as PageType;

  return foundPage.data[fieldName];
};

export const todo = '';
