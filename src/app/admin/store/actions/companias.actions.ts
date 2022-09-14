import { createAction, props } from '@ngrx/store';
import { Compania } from "../../components/models";

export const GET_COMPANIAS = createAction('[COMPAÑÍA PAGE] Init');

export const GET_COMPANIAS_SUCCESS = createAction(
  '[COMPAÑÍA PAGE] Compañías Exito',
  props<{ companias: Compania[] }>()
);

export const GET_COMPANIAS_ERROR = createAction(
  '[COMPAÑÍA PAGE] Compañías Error',
  props<{ error: string }>()
);
