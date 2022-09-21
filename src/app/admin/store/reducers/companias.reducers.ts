import { createReducer, on } from "@ngrx/store";
import { Compania } from "../../components/models";
import { GET_COMPANIAS_SUCCESS } from "../actions/companias.actions";

export const companiasFeatureKey = "companiasState";

export const initialCompaniasState: Compania[] = [];

export const companiasReducer = createReducer(
    initialCompaniasState,
    on(GET_COMPANIAS_SUCCESS, (state, {companias}) => {
      return companias;
    })
);

/* export function reducer(state: CompaniasState | undefined, action: Action) {
  return companiasReducer(state, action);
}
 */
