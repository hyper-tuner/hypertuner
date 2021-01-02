import {
  Dialogs as DialogsType,
} from '../types/config';

const standardDialogs: DialogsType = {
  std_injection: {
    name: 'engineConstants',
    title: 'Engine Constants',
    help: {
      link: 'https://wiki.speeduino.com/en/configuration/Engine_Constants'
    },
    layout: '',
    panels: {
      engine_constants_southwest: {
        name: 'engine_constants_southwest',
        title: 'Speeduino Board',
        layout: '',
        panels: {},
        fields: [], // overridden by ini file
      },
    },
    fields: [
      {
        name: 'reqFuel',
        title: 'Required Fuel',
        help: 'The base reference pulse width required to achieve stoichiometric at 100% VE and a manifold absolute pressure (MAP) of 100kPa using current settings.'
      },
      {
        name: 'algorithm',
        title: 'Control Algorithm',
        help: 'Fueling calculation algorithm',
      },
      {
        name: 'divider',
        title: 'Squirts Per Engine Cycle',
      },
      {
        name: 'alternate',
        title: 'Injector Staging',
        help: 'Whether or not the injectors should be fired at the same time.\nThis setting is ignored when Sequential is selected below, however it will still affect req_fuel value.',
      },
      {
        name: 'twoStroke',
        title: 'Engine Stroke',
        help: 'Four-stroke (most engines) / Two-stroke',
      },
      {
        name: 'nCylinders',
        title: 'Number of Cylinders',
        help: 'Cylinder count',
      },
      {
        name: 'injType',
        title: 'Injector Port Type',
        help: 'Port Injection (one injector for each cylinder) or Throttle Body (injectors shared by cylinders)',
      },
      {
        name: 'nInjectors',
        title: 'Number of Injectors',
        help: 'Number of primary injectors',
      },
      {
        name: 'engineType',
        title: 'Engine Type',
        help: 'Engines with an equal number of degrees between all firings (This is most engines) should select Even fire.\nSome 2 and 6 cylinder engines are Odd fire however',
      },
    ],
  },
};

export default standardDialogs;
