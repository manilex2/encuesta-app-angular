import { createReducer, on } from "@ngrx/store";
import { TiposEncuesta } from "../../components/models";
import { GET_TIPOS_ENCUESTA_SUCCESS } from "../actions/tiposencuesta.actions";

export const tiposEncuestaFeatureKey = "tiposEncuestaState";

export const initialTipoEncuestaState: TiposEncuesta[] = [];

export const tiposEncuestaReducer = createReducer(
    initialTipoEncuestaState,
    on(GET_TIPOS_ENCUESTA_SUCCESS, (state, {tipos_encuesta}) => {
      return tipos_encuesta;
    })
);

/* export function reducer(state: TiposEncuestaState | undefined, action: Action) {
  return tiposEncuestaReducer(state, action);
} */
