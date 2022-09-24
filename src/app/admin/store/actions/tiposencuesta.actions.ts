import { createAction, props } from '@ngrx/store';
import { TiposEncuesta } from "../../components/models";

export const GET_TIPOS_ENCUESTA = createAction('[TIPOS ENCUESTA PAGE] Init');

export const GET_TIPOS_ENCUESTA_SUCCESS = createAction(
  '[TIPOS ENCUESTA PAGE] Tipos de Encuesta Exito',
  props<{ tipos_encuesta: TiposEncuesta[] }>()
);

export const CREATE_TIPOS_ENCUESTA = createAction(
  '[CREATE TIPOS DE ENCUESTA] Init',
  props<{ newTipoEncuesta: TiposEncuesta }>()
);

export const CREATE_TIPOS_ENCUESTA_SUCCESS = createAction(
  '[CREATE TIPOS DE ENCUESTA] Crear Tipo de Encuesta Exito',
  props<{ newTipoEncuesta: TiposEncuesta }>()
);

export const UPDATE_TIPOS_ENCUESTA = createAction(
  '[UPDATE TIPOS DE ENCUESTA] Init',
  props<{ updateTipoEncuesta: TiposEncuesta, identificador: string, codigo: string }>()
);

export const UPDATE_TIPOS_ENCUESTA_SUCCESS = createAction(
  '[UPDATE TIPOS DE ENCUESTA] Tipo de Encuesta Actualizada',
  props<{ updateTipoEncuesta: TiposEncuesta }>()
);

export const DELETE_TIPOS_ENCUESTA = createAction(
  '[DELETE TIPOS DE ENCUESTA] Init',
  props<{ codigo: string, identificador: string }>()
);

export const DELETE_TIPOS_ENCUESTA_SUCCESS = createAction(
  '[DELETE TIPOS DE ENCUESTA] Tipo de Encuesta eliminada',
  props<{ deleteTipoEncuesta: TiposEncuesta }>()
);
