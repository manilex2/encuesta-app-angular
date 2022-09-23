import { createReducer, on } from "@ngrx/store";
import { LOGIN_SUCCESS } from "../actions/login.actions";

export const loginFeatureKey = "loginState";

export const initialLoginState = {};

export const loginReducer = createReducer(
  initialLoginState,
  on(LOGIN_SUCCESS, (state, { token }) => {
    return token;
  }),
);
