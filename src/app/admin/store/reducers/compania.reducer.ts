import { createReducer, on } from "@ngrx/store";
import { Compania } from "../../components/models/Compania";
import { companiasGETSuccess } from "../actions/compania.action";

export const initialState: ReadonlyArray<Compania> = [];

export const companiaReducer = createReducer(
    initialState,
    on(companiasGETSuccess, (state, { companias }) => {
      return companias;
    })
);
