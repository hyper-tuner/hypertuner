import store from '../store';
import {
  Config as ConfigType,
  Constant as ConstantType,
} from '../types/config';
import stdDialogs from '../data/standardDialogs';
import help from '../data/help';
import { divider } from '../data/constants';

const yaml = require('js-yaml');

export const loadAll = () => {
  const started = new Date();

  fetch('/tunes/speeduino.yml')
    .then((response) => response.text())
    .then((yamlContent) => {

      fetch('/tunes/test.msq')
        .then((response) => response.text())
        .then((tune) => {
          const xml = (new DOMParser()).parseFromString(tune, 'text/xml');
          const xmlPages = xml.getElementsByTagName('page');
          const constants: any = {};

          Object.keys(xmlPages).forEach((key: any) => {
            const page = xmlPages[key];
            const pageElements = page.children;

            Object.keys(pageElements).forEach((item: any) => {
              const element = pageElements[item];

              if (element.tagName === 'constant') {
                const attributes: any = {};

                Object.keys(element.attributes).forEach((attr: any) => {
                  attributes[element.attributes[attr].name] = element.attributes[attr].value;
                });

                const val = element.textContent?.replace(/"/g, '').toString();

                constants[attributes.name] = {
                  value: Number.isNaN(Number(val)) ? val : Number(val),
                  // digits: Number.isNaN(Number(attributes.digits)) ? attributes.digits : Number(attributes.digits),
                  // cols: Number.isNaN(Number(attributes.cols)) ? attributes.cols : Number(attributes.cols),
                  // rows: Number.isNaN(Number(attributes.rows)) ? attributes.rows : Number(attributes.rows),
                  // units: attributes.units ?? '',
                };
              }
            });
          });

          const config = yaml.safeLoad(yamlContent) as ConfigType;


          // override / merge standard dialogs, constants and help
          config.dialogs = {
            ...config.dialogs,
            ...stdDialogs,
          };
          config.help = {
            ...config.help,
            ...help,
          };
          config.constants.pages[0].data.divider = divider;

          const loadingTimeInfo = `Tune loaded in ${(new Date().getTime() - started.getTime())}ms`;
          console.log(loadingTimeInfo);

          store.dispatch({ type: 'config/load', payload: config });
          store.dispatch({ type: 'tune/load', payload: { constants } });
          store.dispatch({
            type: 'status',
            payload: loadingTimeInfo,
          });
        });
    });
};

export const test = () => 'test';
