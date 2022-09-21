import { createReducer, on } from "@ngrx/store";
import { Appstate } from "../AppState";
import { setAPIStatus } from "../actions/app.actions";

export const initialAppState: Appstate = {
  apiStatus: '',
  apiResponseMessage: '',
  apiCodeStatus: 200
}

export const appReducer = createReducer(
  initialAppState,
  on(setAPIStatus, (state, { apiStatus }) => {
    return {
      ...state,
      ...apiStatus
    };
  })
)
