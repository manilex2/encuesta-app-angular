import { createAction, props } from '@ngrx/store';
import { Response } from "../../components/models";

export const GET_RESPONSE = createAction('[GET RESPONSE] Init');

export const GET_RESPONSE_SUCCESS = createAction(
  '[GET RESPONSE] Response Exito',
  props<{ response: Response[] }>()
);

export const RESET_RESPONSE = createAction(
  '[RESET RESPONSE] RESPONSE State Reiniciado',
);
