import { Action, createReducer, on } from "@ngrx/store";
import { Admin } from "../../components/models";
import { GET_ADMINS_SUCCESS } from "../actions/admin.actions";

export const adminFeatureKey = "adminState";

export interface AdminState {
  admins: Admin[];
}


const initialAdminState: AdminState = {
  admins: [],
};

const adminReducer = createReducer(
    initialAdminState,
    on(GET_ADMINS_SUCCESS, (state, {admins}) => ({
      ...state,
      admins,
    }))
);

export function reducer(state: AdminState | undefined, action: Action) {
  return adminReducer(state, action);
}
