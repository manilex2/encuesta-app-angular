import { createReducer, on } from "@ngrx/store";
import { TiposEncuesta } from "../../components/models";
import { CREATE_TIPOS_ENCUESTA_SUCCESS, DELETE_TIPOS_ENCUESTA_SUCCESS, GET_TIPOS_ENCUESTA_SUCCESS, RESET_TIPOS_ENCUESTAS, UPDATE_TIPOS_ENCUESTA_SUCCESS } from "../actions/tiposencuesta.actions";

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
          if (a.codigo_cia < b.codigo_cia) return -1;
          if (a.codigo_cia > b.codigo_cia) return 1;
          else {
            if (a.identificador < b.identificador) return -1;
            else if (a.identificador > b.identificador) return 1;
            return 0;
          }
        }
      });
      return newState;
    }),
    on(UPDATE_TIPOS_ENCUESTA_SUCCESS, (state, { updateTipoEncuesta }) => {
      let newState = state.filter((_) => !(_.codigo == updateTipoEncuesta.codigo_ant && _.identificador == updateTipoEncuesta.identificador_ant && _.codigo_cia == updateTipoEncuesta.codigo_cia_ant));
      newState.push(updateTipoEncuesta);
      newState.sort((a, b) => {
        if (a.codigo < b.codigo) return -1;
        if (a.codigo > b.codigo) return 1;
        else {
          if (a.codigo_cia < b.codigo_cia) return -1;
          if (a.codigo_cia > b.codigo_cia) return 1;
          else {
            if (a.identificador < b.identificador) return -1;
            else if (a.identificador > b.identificador) return 1;
            return 0;
          }
        }
      });
      return newState;
    }),
    on(DELETE_TIPOS_ENCUESTA_SUCCESS, (state, { deleteTipoEncuesta }) => {
      let newState = state.filter((_) => !(_.codigo == deleteTipoEncuesta.codigo && _.codigo_cia == deleteTipoEncuesta.codigo_cia && _.identificador == deleteTipoEncuesta.identificador));
      return newState;
    }),
    on(RESET_TIPOS_ENCUESTAS, (state, ) => {
      let newState = [...state];
      newState.length = 0;
      return newState
    })
);

/* export function reducer(state: TiposEncuestaState | undefined, action: Action) {
  return tiposEncuestaReducer(state, action);
} */
