import { createReducer, on } from "@ngrx/store";
import { TiposEncuesta } from "../../components/models";
import { CREATE_TIPOS_ENCUESTA_SUCCESS, DELETE_TIPOS_ENCUESTA, DELETE_TIPOS_ENCUESTA_SUCCESS, GET_TIPOS_ENCUESTA_SUCCESS, UPDATE_TIPOS_ENCUESTA, UPDATE_TIPOS_ENCUESTA_SUCCESS } from "../actions/tiposencuesta.actions";

export const tiposEncuestaFeatureKey = "tiposEncuestaState";

export const initialTipoEncuestaState: TiposEncuesta[] = [];

export const tiposEncuestaReducer = createReducer(
    initialTipoEncuestaState,
    on(GET_TIPOS_ENCUESTA_SUCCESS, (state, {tipos_encuesta}) => {
      return tipos_encuesta;
    }),
    on(CREATE_TIPOS_ENCUESTA_SUCCESS, (state, { newTipoEncuesta }) => {
      let newState = [...state];
      newState.push(newTipoEncuesta);
      newState.sort((a, b) => {
        if (a.codigo < b.codigo) return -1;
        if (a.codigo > b.codigo) return 1;
        else {
          if (a.identificador > b.identificador) return 1;
          else if (a.identificador < b.identificador) return -1;
          return 0;
        }
      });
      return newState;
    }),
    on(UPDATE_TIPOS_ENCUESTA_SUCCESS, (state, { updateTipoEncuesta }) => {
      let newState = state.filter((_) => !(_.identificador == updateTipoEncuesta.identificador_ant && _.codigo == updateTipoEncuesta.codigo_ant));;
      console.log(newState);
      newState.push(updateTipoEncuesta);
      newState.sort((a, b) => {
        if (a.codigo < b.codigo) return -1;
        if (a.codigo > b.codigo) return 1;
        else {
          if (a.identificador > b.identificador) return 1;
          else if (a.identificador < b.identificador) return -1;
          return 0;
        }
      });
      return newState;
    }),
    on(DELETE_TIPOS_ENCUESTA_SUCCESS, (state, { deleteTipoEncuesta }) => {
      let newState = state.filter((_) => !(_.identificador == deleteTipoEncuesta.identificador && _.codigo == deleteTipoEncuesta.codigo));
      return newState;
    })
);

/* export function reducer(state: TiposEncuestaState | undefined, action: Action) {
  return tiposEncuestaReducer(state, action);
} */
