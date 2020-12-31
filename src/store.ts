/* eslint-disable no-param-reassign */

import { configureStore, createAction, createReducer } from '@reduxjs/toolkit';
import * as Types from './types/state';

// tune and config
const updateTune = createAction<Types.UpdateTunePayload>('tune/update');
const loadTune = createAction<Types.TuneState>('tune/load');
const loadConfig = createAction<Types.ConfigState>('config/load');

// status bar
const setStatus = createAction<string>('status');

// ui
const setSidebarCollapsed = createAction<boolean>('ui/sidebarCollapsed');
const toggleSidebar = createAction('ui/toggleSidebar');

const initialState: Types.AppState = {
  tune: {
    constants: {},
  },
  config: {} as any,
  ui: {
    sidebarCollapsed: false,
  },
  status: {
    text: null,
  },
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
    .addCase(setSidebarCollapsed, (state: Types.AppState, action) => {
      state.ui.sidebarCollapsed = action.payload;
    })
    .addCase(toggleSidebar, (state: Types.AppState) => {
      state.ui.sidebarCollapsed = !state.ui.sidebarCollapsed;
    })
    .addCase(setStatus, (state: Types.AppState, action) => {
      state.status.text = action.payload;
    });
});

const store = configureStore({
  reducer: rootReducer
});

export default store;
