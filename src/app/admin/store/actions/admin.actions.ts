import { createAction, props } from '@ngrx/store';
import { Admin } from "../../components/models";

export const GET_ADMINS = createAction('[ADMIN PAGE] Init');

export const GET_ADMINS_SUCCESS = createAction(
  '[ADMIN PAGE] Admins Exito',
  props<{ admins: Admin[] }>()
);

export const GET_ADMINS_ERROR = createAction(
  '[ADMIN PAGE] Admins Error',
  props<{ error: string }>()
);
