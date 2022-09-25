import { createReducer, on } from "@ngrx/store";
import { Admin } from "../../components/models";
import { CREATE_ADMIN_SUCCESS, DELETE_ADMIN_SUCCESS, GET_ADMINS_SUCCESS, RESET_ADMINS, UPDATE_ADMIN_SUCCESS } from "../actions/admin.actions";

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
      let newState = state.filter((_) => _.codigo != updateAdmin.codigo_ant);
      newState.push(updateAdmin);
      newState.sort((a, b) => a.codigo - b.codigo);
      return newState;
    }),
    on(DELETE_ADMIN_SUCCESS, (state, { deleteAdmin }) => {
      let newState = state.filter((_) => _.codigo != deleteAdmin.codigo);
      return newState;
    }),
    on(RESET_ADMINS, (state, ) => {
      let newState = [...state];
      newState.length = 0;
      return newState
    })
);

/* export function reducer(state: AdminState | undefined, action: Action) {
  return adminReducer(state, action);
}
 */
