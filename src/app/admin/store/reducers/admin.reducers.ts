import { createReducer, on } from "@ngrx/store";
import { Admin } from "../../components/models";
import { CREATE_ADMIN_SUCCESS, DELETE_ADMIN_SUCCESS, GET_ADMINS_SUCCESS, UPDATE_ADMIN_SUCCESS } from "../actions/admin.actions";

export const adminFeatureKey = "adminState";

export const initialAdminState: Admin[] = [];

export const adminReducer = createReducer(
    initialAdminState,
    on(GET_ADMINS_SUCCESS, (state, {admins}) => {
      return admins;
    }),
    on(CREATE_ADMIN_SUCCESS, (state, { newAdmin }) => {
      let newState = [...state];
      newState.push(newAdmin);
      return newState;
    }),
    on(UPDATE_ADMIN_SUCCESS, (state, { updateAdmin }) => {
      let newState = state.filter((_) => _.codigo != updateAdmin.codigo);;
      newState.push(updateAdmin);
      return newState;
    }),
    on(DELETE_ADMIN_SUCCESS, (state, { deleteAdmin }) => {
      let newState = state.filter((_) => _.codigo != deleteAdmin.codigo);;
      return newState;
    })
);

/* export function reducer(state: AdminState | undefined, action: Action) {
  return adminReducer(state, action);
}
 */
