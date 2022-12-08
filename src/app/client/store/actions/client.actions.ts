import { createAction, props } from '@ngrx/store';
import { Client, Preguntas } from "../../components/models";

export const GET_CLIENT = createAction('[GET ADMINS] Init');

export const GET_CLIENT_SUCCESS = createAction(
  '[GET CLIENT] Client Exito',
  props<{ encuestas: Client[] }>()
);

export const SEND_ENCUESTA = createAction(
  '[SEND ENCUESTA] Init',
  props<{ preguntas: Client[] }>()
);

export const SEND_ENCUESTA_SUCCESS = createAction(
  '[SEND ENCUESTA] Send Encuesta Exito',
  props<{ newSend: Client }>()
);

export const RESET_CLIENT = createAction(
  '[RESET CLIENT] Client State Reiniciado',
);
