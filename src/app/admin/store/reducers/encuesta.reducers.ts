import { createReducer, on } from "@ngrx/store";
import { Encuesta } from "../../components/models";
import { GET_ENCUESTA_SUCCESS, CREATE_ENCUESTA_SUCCESS, UPDATE_ENCUESTA_SUCCESS, DELETE_ENCUESTA_SUCCESS, RESET_ENCUESTAS } from "../actions/encuesta.actions";

export const encuestaFeatureKey = "encuestaState";

export const initialEncuestaState: Encuesta[] = [];

export const encuestaReducer = createReducer(
    initialEncuestaState,
    on(GET_ENCUESTA_SUCCESS, (state, {encuesta}) => {
      return encuesta;
    }),
    on(CREATE_ENCUESTA_SUCCESS, (state, { newEncuesta }) => {
      let newState = [...state];
      newState.push(newEncuesta);
      newState.sort((a, b) => {
        if (a.codigo < b.codigo) return -1;
        if (a.codigo > b.codigo) return 1;
        else {
          if (a.codigo_cia < b.codigo_cia) return -1;
          if (a.codigo_cia > b.codigo_cia) return 1;
          else {
            if (a.identificador < b.identificador) return -1;
            if (a.identificador > b.identificador) return 1;
            else {
              if (a.numero < b.numero) return -1;
              else if (a.numero > b.numero) return 1;
              return 0;
            }
          }
        }
      });
      return newState;
    }),
    on(UPDATE_ENCUESTA_SUCCESS, (state, { updateEncuesta }) => {
      let newState = state.filter((_) => !(_.codigo == updateEncuesta.codigo_ant && _.codigo_cia == updateEncuesta.codigo_cia_ant && _.identificador == updateEncuesta.identificador_ant && _.numero == updateEncuesta.numero_ant));
      newState.push(updateEncuesta);
      newState.sort((a, b) => {
        if (a.codigo < b.codigo) return -1;
        if (a.codigo > b.codigo) return 1;
        else {
          if (a.codigo_cia < b.codigo_cia) return -1;
          if (a.codigo_cia > b.codigo_cia) return 1;
          else {
            if (a.identificador < b.identificador) return -1;
            if (a.identificador > b.identificador) return 1;
            else {
              if (a.numero < b.numero) return -1;
              else if (a.numero > b.numero) return 1;
              return 0;
            }
          }
        }
      });
      return newState;
    }),
    on(DELETE_ENCUESTA_SUCCESS, (state, { deleteEncuesta }) => {
      let newState = state.filter((_) => !(_.codigo == deleteEncuesta.codigo && _.codigo_cia == deleteEncuesta.codigo_cia && _.identificador == deleteEncuesta.identificador && _.numero == deleteEncuesta.numero));
      return newState;
    }),
    on(RESET_ENCUESTAS, (state, ) => {
      let newState = [...state];
      newState.length = 0;
      return newState
    })
);

/* export function reducer(state: TiposEncuestaState | undefined, action: Action) {
  return tiposEncuestaReducer(state, action);
} */
