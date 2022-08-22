import { createReducer, on } from "@ngrx/store";
import { Admin } from "../../components/models/Admin";
import { adminGETSuccess } from "../actions/admin.action";

export const initialState: ReadonlyArray<Admin> = [];

export const adminReducer = createReducer(
    initialState,
    on(adminGETSuccess, (state, { admins }) => {
      return admins;
    })
);
