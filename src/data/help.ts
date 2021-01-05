import {
  Help as HelpType,
} from '../types/config';

export const help: HelpType = {
  reqFuel: 'The base reference pulse width required to achieve stoichiometric at 100% VE and a manifold absolute pressure (MAP) of 100kPa using current settings.',
  algorithm: 'Fueling calculation algorithm',
  alternate: 'Whether or not the injectors should be fired at the same time.\nThis setting is ignored when Sequential is selected below, however it will still affect req_fuel value.',
  twoStroke: 'Four-stroke (most engines) / Two-stroke',
  nCylinders: 'Cylinder count',
  injType: 'Port Injection (one injector for each cylinder) or Throttle Body (injectors shared by cylinders)',
  nInjectors: 'Number of primary injectors',
  engineType: 'Engines with an equal number of degrees between all firings (This is most engines) should select Even fire.\nSome 2 and 6 cylinder engines are Odd fire however',
};

export default help;
