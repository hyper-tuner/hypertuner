/* eslint-disable no-param-reassign */

import { configureStore, createAction, createReducer } from '@reduxjs/toolkit'
import * as Types from './types';

const updateTune = createAction<Types.UpdateTunePayload>('tune/update');
const loadTune = createAction<Types.TuneState>('tune/load');
const loadConfig = createAction<Types.ConfigState>('config/load');

const initialState: Types.AppState = {
  tune: {
    constants: {},
  },
  config: {},
};

const rootReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loadConfig, (state: Types.AppState, action) => {
      state.config = action.payload;
    })
    .addCase(loadTune, (state: Types.AppState, action) => {
      state.tune = action.payload;
    })
    .addCase(updateTune, (state: Types.AppState, action) => {
      state.tune.constants[action.payload.name] = action.payload.value;
    })
})

const store = configureStore({
  reducer: rootReducer
})

export default store;
