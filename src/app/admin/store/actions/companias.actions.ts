import { createAction, props } from '@ngrx/store';
import { Compania } from "../../components/models";

export const GET_COMPANIAS = createAction('[COMPAÑÍA PAGE] Init');

export const GET_COMPANIAS_SUCCESS = createAction(
  '[COMPAÑÍA PAGE] Compañías Exito',
  props<{ companias: Compania[] }>()
);

export const CREATE_COMPANIA = createAction(
  '[CREATE COMPAÑÍA] Init',
  props<{ newCompania: Compania }>()
);

export const CREATE_COMPANIA_SUCCESS = createAction(
  '[CREATE COMPAÑÍA] Crear Compañía Exito',
  props<{ newCompania: Compania }>()
);

export const UPDATE_COMPANIA = createAction(
  '[UPDATE COMPAÑÍA] Init',
  props<{ updateCompania: Compania, codigo_cia: string, codigo: string }>()
);

export const UPDATE_COMPANIA_SUCCESS = createAction(
  '[UPDATE COMPAÑÍA] Compañía Actualizada',
  props<{ updateCompania: Compania }>()
);

export const DELETE_COMPANIA = createAction(
  '[DELETE COMPAÑÍA] Init',
  props<{ codigo: string, codigo_cia: string }>()
);

export const DELETE_COMPANIA_SUCCESS = createAction(
  '[DELETE COMPAÑÍA] Compañía eliminada',
  props<{ deleteCompania: Compania }>()
);
