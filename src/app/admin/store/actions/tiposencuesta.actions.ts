import { createAction, props } from '@ngrx/store';
import { TiposEncuesta } from "../../components/models";

export const GET_TIPOS_ENCUESTA = createAction('[TIPOS ENCUESTA PAGE] Init');

export const GET_TIPOS_ENCUESTA_SUCCESS = createAction(
  '[TIPOS ENCUESTA PAGE] Tipos de Encuesta Exito',
  props<{ tipos_encuesta: TiposEncuesta[] }>()
);

export const GET_TIPOS_ENCUESTA_ERROR = createAction(
  '[TIPOS ENCUESTA PAGE] Tipos de Encuesta Error',
  props<{ error: string }>()
);
