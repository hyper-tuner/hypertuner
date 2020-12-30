import { Config } from './config';

interface ConfigState extends Config {}

interface TuneState {
  constants: {
    [name: string]: string | number,
  },
}

interface UIState {
  sidebarCollapsed: boolean,
}

interface StatusState {
  text: string | null,
}

interface AppState {
  tune: TuneState,
  config: ConfigState,
  ui: UIState,
  status: StatusState,
}

interface UpdateTunePayload {
  name: string,
  value: string | number,
}

export type {
  ConfigState,
  TuneState,
  AppState,
  UpdateTunePayload,
  UIState,
  StatusState,
};
