import { createReducer, on } from "@ngrx/store";
import { Response } from "../../components/models";
import { GET_RESPONSE_SUCCESS, RESET_RESPONSE } from "../actions/response.actions";

export const responseFeatureKey = "responseState";

export const initialResponseState: Response[] = [];

export const responseReducer = createReducer(
  initialResponseState,
    on(GET_RESPONSE_SUCCESS, (state, {response}) => {
      return response;
    }),
    on(RESET_RESPONSE, (state, ) => {
      let newState = [...state];
      newState.length = 0;
      return newState
    })
);

/* export function reducer(state: AdminState | undefined, action: Action) {
  return adminReducer(state, action);
}
 */
