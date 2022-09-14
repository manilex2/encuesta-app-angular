import { Action, createReducer, on } from "@ngrx/store";
import { Compania } from "../../components/models";
import { GET_COMPANIAS_SUCCESS } from "../actions/companias.actions";

export const companiasFeatureKey = "companiasState";

export interface CompaniasState {
  companias: Compania[];
}


const initialCompaniasState: CompaniasState = {
  companias: [],
};

const companiasReducer = createReducer(
    initialCompaniasState,
    on(GET_COMPANIAS_SUCCESS, (state, {companias}) => ({
      ...state,
      companias,
    }))
);

export function reducer(state: CompaniasState | undefined, action: Action) {
  return companiasReducer(state, action);
}
