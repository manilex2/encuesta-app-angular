import { createAction, props } from '@ngrx/store';
import { Encuesta } from "../../components/models";

export const GET_ENCUESTA = createAction('[ENCUESTA PAGE] Init');

export const GET_ENCUESTA_SUCCESS = createAction(
  '[ENCUESTA PAGE] Encuesta Exito',
  props<{ encuesta: Encuesta[] }>()
);

export const CREATE_ENCUESTA = createAction(
  '[CREATE ENCUESTA] Init',
  props<{ newEncuesta: Encuesta }>()
);

export const CREATE_ENCUESTA_SUCCESS = createAction(
  '[CREATE ENCUESTA] Crear Encuesta Exito',
  props<{ newEncuesta: Encuesta }>()
);

export const UPDATE_ENCUESTA = createAction(
  '[UPDATE ENCUESTA] Init',
  props<{ updateEncuesta: Encuesta, codigo: string, codigo_cia: string, identificador: string, numero: number }>()
);

export const UPDATE_ENCUESTA_SUCCESS = createAction(
  '[UPDATE ENCUESTA] Encuesta Actualizada',
  props<{ updateEncuesta: Encuesta }>()
);

export const DELETE_ENCUESTA = createAction(
  '[DELETE ENCUESTA] Init',
  props<{ codigo: string, codigo_cia: string, identificador: string, numero: number }>()
);

export const DELETE_ENCUESTA_SUCCESS = createAction(
  '[DELETE ENCUESTA] Encuesta eliminada',
  props<{ deleteEncuesta: Encuesta }>()
);

export const RESET_ENCUESTAS = createAction(
  '[RESET ENCUESTA] Encuesta State Reiniciado'
);
