import { Action, createReducer, on } from "@ngrx/store";
import { CurrentUser } from "../../components/models";
import { GET_CURRENT_USER_SUCCESS } from "../actions/currentuser.actions";

export const currentUserFeatureKey = "currentUserState";

export interface CurrentUserState {
  currentUser: CurrentUser;
}


const initialCurrentState: CurrentUserState = {
  currentUser: {
    codigo: "",
    nombre: "",
    fsbs: false,
    logo: undefined
  },
};

const currentUserReducer = createReducer(
    initialCurrentState,
    on(GET_CURRENT_USER_SUCCESS, (state, {currentUser}) => ({
      ...state,
      currentUser,
    }))
);

export function reducer(state: CurrentUserState | undefined, action: Action) {
  return currentUserReducer(state, action);
}
