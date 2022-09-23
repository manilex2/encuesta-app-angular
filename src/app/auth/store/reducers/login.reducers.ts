import { createReducer, on } from "@ngrx/store";
import { LOGIN_SUCCESS, LOGOUT } from "../actions/login.actions";

export const loginFeatureKey = "loginState";

export const initialLoginState = {};

export const loginReducer = createReducer(
  initialLoginState,
  on(LOGIN_SUCCESS, (state, { token }) => {
    return token;
  }),
  on(LOGOUT, (state) => {
    return state;
  })
);
