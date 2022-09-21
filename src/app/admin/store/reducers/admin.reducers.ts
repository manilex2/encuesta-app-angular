import { createReducer, on } from "@ngrx/store";
import { Admin } from "../../components/models";
import { CREATE_ADMIN_SUCCESS, GET_ADMINS_SUCCESS } from "../actions/admin.actions";

export const adminFeatureKey = "adminState";

export const initialAdminState: Admin[] = [];

export const adminReducer = createReducer(
    initialAdminState,
    on(GET_ADMINS_SUCCESS, (state, {admins}) => {
      return admins;
    }),
    on(CREATE_ADMIN_SUCCESS, (state, { newUser }) => {
      let newState = [...state];
      newState.push(newUser);
      return newState;
    })
);

/* export function reducer(state: AdminState | undefined, action: Action) {
  return adminReducer(state, action);
}
 */
