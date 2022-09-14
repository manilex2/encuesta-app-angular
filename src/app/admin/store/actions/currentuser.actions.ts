import { createAction, props } from '@ngrx/store';
import { CurrentUser } from "../../components/models";

export const GET_CURRENT_USER = createAction('[ADMIN MODULE] Init');

export const GET_CURRENT_USER_SUCCESS = createAction(
  '[ADMIN MODULE] Usuario Actual Exito',
  props<{ currentUser: CurrentUser }>()
);

export const GET_CURRENT_USER_ERROR = createAction(
  '[ADMIN MODULE] Usuario Actual Error',
  props<{ error: string }>()
);
