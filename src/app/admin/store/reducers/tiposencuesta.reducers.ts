import { Action, createReducer, on } from "@ngrx/store";
import { TiposEncuesta } from "../../components/models";
import { GET_TIPOS_ENCUESTA_SUCCESS } from "../actions/tiposencuesta.actions";

export const tiposEncuestaFeatureKey = "tiposEncuestaState";

export interface TiposEncuestaState {
  tipos_encuesta: TiposEncuesta[];
}


const initialAdminState: TiposEncuestaState = {
  tipos_encuesta: [],
};

const tiposEncuestaReducer = createReducer(
    initialAdminState,
    on(GET_TIPOS_ENCUESTA_SUCCESS, (state, {tipos_encuesta}) => ({
      ...state,
      tipos_encuesta,
    }))
);

export function reducer(state: TiposEncuestaState | undefined, action: Action) {
  return tiposEncuestaReducer(state, action);
}
