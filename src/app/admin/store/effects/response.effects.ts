import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from "@ngrx/store";
import { catchError, map, exhaustMap, EMPTY, withLatestFrom, tap } from 'rxjs';
import { setAPIStatus } from "src/app/shared/store/actions/app.actions";
import { Appstate } from "src/app/shared/store/AppState";
import { selectAppState } from "src/app/shared/store/selectors/app.selectors";
import { AdminService } from '../../services/admin.service';
import { GET_RESPONSE, GET_RESPONSE_SUCCESS, RESET_RESPONSE } from '../actions/response.actions';
import { selectResponse } from "../selectors/response.selectors";
import { Response } from "../../components/models";

@Injectable()
export class ClientDataEffect {
  constructor(
    private actions$: Actions,
    private adminService: AdminService,
    private appStore: Store<Appstate>,
    private store: Store
  ) {}

  loadAllAdmins$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GET_RESPONSE),
      withLatestFrom(this.store.pipe(select(selectResponse))),
      exhaustMap(([, responseFromStore]) => {
        let loginStatus: any;
        let token = localStorage.getItem('auth_token');
        this.appStore.pipe(select(selectAppState)).subscribe(data => loginStatus = data.loginStatus);
        if (loginStatus === "logout" && !token) {
          return EMPTY;
        } else {
          this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: '', apiCodeStatus: 200, loginStatus: "logged"}}))
        }
        if (responseFromStore.length > 0) {
          this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: '', apiCodeStatus: 200, responseState: "done"}}))
          return EMPTY;
        }
        return this.adminService.obtenerClientResponse().pipe(
          map(response => {
            this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: 'success', apiCodeStatus: 200, responseState: 'getted'}}))
            return GET_RESPONSE_SUCCESS({ response })
          }),
          catchError((error) => {
            if (error.statusText === "Unknown Error") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Ocurrió un error con el servidor, intente de nuevo, en caso de persistir, comuniquese con el personal de sistemas", apiStatus: 'error', apiCodeStatus: error.status, responseState: "gettedError"}}))
              throw error;
            } else if (error.statusText === "Unauthorized") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Su token de sesión expiró o es inválido. Inicie nuevamente sesión.", apiStatus: 'error', apiCodeStatus: error.status, responseState: "gettedError"}}))
              throw error;
            } else {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: error.error.message, apiStatus: 'error', apiCodeStatus: error.status, responseState: "gettedError"}}))
              throw error;
            }
          })
        );
      })
    )
  );

  resetResponse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RESET_RESPONSE),
      tap((state) => {
        return state.type
      })
    ), {dispatch: false}
  );
};
