interface ConfigState {
  [id: string]: {},
};

interface TuneState {
  constants: {
    [id: string]: {},
  },
};

interface AppState {
  tune: TuneState,
  config: ConfigState,
};

interface UpdateTunePayload {
  name: string,
  value: string | number,
};

export type { ConfigState, TuneState, AppState, UpdateTunePayload };
