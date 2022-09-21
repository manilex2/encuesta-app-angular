import { createAction, props } from '@ngrx/store';
import { CurrentUser } from "../../components/models";

export const GET_CURRENT_USER = createAction('[GET USER] Init');

export const GET_CURRENT_USER_SUCCESS = createAction(
  '[GET USER] Usuario Actual Exito',
  props<{ currentUser: CurrentUser }>()
);

export const GET_CURRENT_USER_ERROR = createAction(
  '[GET USER] Usuario Actual Error',
  props<{ error: string }>()
);
