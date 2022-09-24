import { createReducer, on } from "@ngrx/store";
import { Compania } from "../../components/models";
import { GET_COMPANIAS_SUCCESS, UPDATE_COMPANIA_SUCCESS, CREATE_COMPANIA_SUCCESS, DELETE_COMPANIA_SUCCESS } from "../actions/companias.actions";

export const companiasFeatureKey = "companiasState";

export const initialCompaniasState: Compania[] = [];

export const companiasReducer = createReducer(
    initialCompaniasState,
    on(GET_COMPANIAS_SUCCESS, (state, {companias}) => {
      return companias;
    }),
    on(CREATE_COMPANIA_SUCCESS, (state, { newCompania }) => {
      let newState = [...state];
      newState.push(newCompania);
      newState.sort((a, b) => {
        if (a.codigo < b.codigo) return -1;
        if (a.codigo > b.codigo) return 1;
        else {
          if (a.codigo_cia > b.codigo_cia) return 1;
          else if (a.codigo_cia < b.codigo_cia) return -1;
          return 0;
        }
      });
      return newState;
    }),
    on(UPDATE_COMPANIA_SUCCESS, (state, { updateCompania }) => {
      let newState = state.filter((_) => !(_.codigo_cia == updateCompania.codigo_cia_ant && _.codigo == updateCompania.codigo_ant));;
      newState.push(updateCompania);
      newState.sort((a, b) => {
        if (a.codigo < b.codigo) return -1;
        if (a.codigo > b.codigo) return 1;
        else {
          if (a.codigo_cia > b.codigo_cia) return 1;
          else if (a.codigo_cia < b.codigo_cia) return -1;
          return 0;
        }
      });
      return newState;
    }),
    on(DELETE_COMPANIA_SUCCESS, (state, { deleteCompania }) => {
      let newState = state.filter((_) => !(_.codigo_cia == deleteCompania.codigo_cia && _.codigo == deleteCompania.codigo));
      return newState;
    })
);

/* export function reducer(state: CompaniasState | undefined, action: Action) {
  return companiasReducer(state, action);
}
 */
