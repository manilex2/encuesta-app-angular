import { createAction, props } from '@ngrx/store';
import { Admin } from "../../components/models";

export const GET_ADMINS = createAction('[GET ADMINS] Init');

export const GET_ADMINS_SUCCESS = createAction(
  '[GET ADMINS] Admins Exito',
  props<{ admins: Admin[] }>()
);

export const CREATE_ADMIN = createAction(
  '[CREATE ADMIN] Init',
  props<{ newAdmin: Admin }>()
);

export const CREATE_ADMIN_SUCCESS = createAction(
  '[CREATE ADMIN] Crear Admin Exito',
  props<{ newAdmin: Admin }>()
);

export const UPDATE_ADMIN = createAction(
  '[UPDATE ADMIN] Init',
  props<{ updateAdmin: Admin }>()
);

export const UPDATE_ADMIN_SUCCESS = createAction(
  '[UPDATE ADMIN] Admin Actualizado',
  props<{ updateAdmin: Admin }>()
);

export const DELETE_ADMIN = createAction(
  '[DELETE ADMIN] Init',
  props<{ codigo: string }>()
);

export const DELETE_ADMIN_SUCCESS = createAction(
  '[DELETE ADMIN] Admin eliminado',
  props<{ deleteAdmin: Admin }>()
);
