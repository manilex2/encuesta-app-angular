import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from "@ngrx/store";
import { catchError, map, of, exhaustMap, concatMap, withLatestFrom, EMPTY, tap, switchMap, mergeMap } from 'rxjs';
import { Appstate } from "../../../shared/store/AppState";
import { ClientService } from '../../services/client.service';
import {
  GET_CLIENT,
  GET_CLIENT_SUCCESS,
  RESET_CLIENT,
  SEND_ENCUESTA,
  SEND_ENCUESTA_SUCCESS
} from '../actions/client.actions';
import { setAPIStatus } from "../../../shared/store/actions/app.actions";
import { selectClient } from "../selectors/client.selectors";
import { selectAppState } from "src/app/shared/store/selectors/app.selectors";

@Injectable()
export class ClientEffect {
  constructor(
    private actions$: Actions,
    private clientService: ClientService,
    private appStore: Store<Appstate>,
    private store: Store
  ) {}

  loadClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GET_CLIENT),
      withLatestFrom(this.store.pipe(select(selectClient))),
      exhaustMap(([, clientsFromStore]) => {
        let loginStatus: any;
        let token = localStorage.getItem('auth_token');
        this.appStore.pipe(select(selectAppState)).subscribe(data => loginStatus = data.loginStatus);
        if (loginStatus === "logout" && !token) {
          return EMPTY;
        } else {
          this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: '', apiCodeStatus: 200, loginStatus: "logged"}}))
        }
        if (clientsFromStore.length > 0) {
          this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: '', apiCodeStatus: 200, clientState: "done"}}))
          return EMPTY;
        }
        return this.clientService.obtenerClientData().pipe(
          map(client => {
            this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: 'success', apiCodeStatus: 200, clientState: 'getted'}}))
            return GET_CLIENT_SUCCESS({ encuestas: client })
          }),
          catchError((error) => {
            if (error.statusText === "Unknown Error") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Ocurrió un error con el servidor, intente de nuevo, en caso de persistir, comuniquese con el personal de sistemas", apiStatus: 'error', apiCodeStatus: error.status, clientState: "gettedError"}}))
              throw error;
            } else if (error.statusText === "Unauthorized") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Su token de sesión expiró o es inválido. Inicie nuevamente sesión.", apiStatus: 'error', apiCodeStatus: error.status, clientState: "gettedError"}}))
              throw error;
            } else {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: error.error.message, apiStatus: 'error', apiCodeStatus: error.status, clientState: "gettedError"}}))
              throw error;
            }
          })
        );
      })
    )
  );
};
