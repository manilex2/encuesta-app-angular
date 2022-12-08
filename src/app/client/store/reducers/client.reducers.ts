import { createReducer, on } from "@ngrx/store";
import { Client } from "../../components/models";
import { GET_CLIENT_SUCCESS, SEND_ENCUESTA_SUCCESS, RESET_CLIENT } from "../actions/client.actions";

export const clientFeatureKey = "clientState";

export const initialClientState: Client[] = [];

export const clientReducer = createReducer(
  initialClientState,
    on(GET_CLIENT_SUCCESS, (state, {encuestas}) => {
      return encuestas;
    }),
    on(SEND_ENCUESTA_SUCCESS, (state, { newSend }) => {
      let newState = [...state];
      newState.push(newSend);
      return newState;
    }),
    on(RESET_CLIENT, (state, ) => {
      let newState = [...state];
      newState.length = 0;
      return newState
    })
);

/* export function reducer(state: AdminState | undefined, action: Action) {
  return adminReducer(state, action);
}
 */
