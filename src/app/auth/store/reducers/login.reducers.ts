import { createReducer, on } from "@ngrx/store";
import { User } from "../../components/models";
import { LOGIN_SUCCESS } from "../actions/login.actions";

export const loginFeatureKey = "loginState";

export const initialAdminState: User = {};

export const loginReducer = createReducer(
    initialAdminState,
    on(LOGIN_SUCCESS, (state, {token}) => {
      return token;
    })
);
