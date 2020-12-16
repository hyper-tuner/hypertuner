import store from '../store';
const yaml = require('js-yaml');

export const loadAll = () => {
  fetch('/tunes/speeduino.yml')
    .then((response) => response.text())
    .then((config) => {

      fetch('/tunes/test.msq')
        .then((response) => response.text())
        .then((tune) => {
          const xml = (new DOMParser()).parseFromString(tune, 'text/xml');
          const xmlPages = xml.getElementsByTagName('page');
          const constants: any = {};

          for (let key in xmlPages) {
            const page = xmlPages[key];
            const pageElements = page.children;

            for (const item in pageElements) {
              const element = pageElements[item];

              if (element.tagName === 'constant') {
                const attributes: any = {};

                for (const attr in element.attributes) {
                  attributes[element.attributes[attr].name] = element.attributes[attr].value;
                }

                const val = element.textContent?.replace(/"/g, '').toString();

                constants[attributes.name] = {
                  value: isNaN(Number(val)) ? val : Number(val),
                  digits: isNaN(Number(attributes.digits)) ? attributes.digits : Number(attributes.digits),
                  cols: isNaN(Number(attributes.cols)) ? attributes.cols : Number(attributes.cols),
                  rows: isNaN(Number(attributes.rows)) ? attributes.rows : Number(attributes.rows),
                  units: attributes.units ?? '',
                }
              }
            }
          }

          store.dispatch({ type: 'config/load', payload: yaml.safeLoad(config) });
          store.dispatch({ type: 'tune/load', payload: { constants } });
        });
    });
}
