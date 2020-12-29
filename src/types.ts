interface ConfigState {
  [id: string]: {},
}

interface TuneState {
  constants: {
    [id: string]: {},
  },
}

interface UIState {
  sidebarCollapsed: boolean,
}

interface AppState {
  tune: TuneState,
  config: ConfigState,
  ui: UIState,
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
};
