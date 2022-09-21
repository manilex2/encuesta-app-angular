import { createAction, props } from '@ngrx/store';
import { Admin } from "../../components/models";

export const GET_ADMINS = createAction('[GET ADMINS] Init');

export const GET_ADMINS_SUCCESS = createAction(
  '[GET ADMINS] Admins Exito',
  props<{ admins: Admin[] }>()
);

export const CREATE_ADMIN = createAction(
  '[CREATE ADMIN] Init',
  props<{ newUser: Admin }>()
);

export const CREATE_ADMIN_SUCCESS = createAction(
  '[CREATE ADMIN] Crear Admin Exito',
  props<{ newUser: Admin }>()
);
