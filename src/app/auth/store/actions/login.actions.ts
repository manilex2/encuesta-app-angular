import { createAction, props } from '@ngrx/store';
import { User } from "../../components/models";

export const LOGIN = createAction(
  '[LOGIN] Iniciar Sesion',
  props<{ user: User }>()
);

export const LOGIN_SUCCESS = createAction(
  '[LOGIN] Login Exito',
  props<{ token: string }>()
);

export const LOGOUT = createAction(
  '[LOGIN] Iniciar Sesion'
);
