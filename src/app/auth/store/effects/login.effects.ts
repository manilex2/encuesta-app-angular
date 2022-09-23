import { Injectable } from "@angular/core";
import { act, Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from "@ngrx/store";
import { catchError, map, concatMap, tap, exhaustMap, switchMap, withLatestFrom, EMPTY, takeUntil } from 'rxjs';
import { Appstate } from "../../../shared/store/AppState";
import { AuthService } from '../../services/auth.service';
import {
  LOGIN,
  LOGIN_SUCCESS
} from '../actions/login.actions';
import { setAPIStatus } from "../../../shared/store/actions/app.actions";
import { Router } from "@angular/router";
import { selectAdmins } from "src/app/admin/store/selectors/admin.selectors";
import { Admin } from "src/app/admin/components/models";

@Injectable()
export class LoginEffect {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private appStore: Store<Appstate>,
    private router: Router,
    private store: Store<Admin>,
  ) {}

  /* logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOGOUT),
      tap(() => {})
    ), {dispatch: false}
  ) */

  /* login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOGIN),
      concatMap((action) => {
        this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: '', apiCodeStatus: 200}}))
        return this.authService.login(action.user).pipe(
          map((token) => {
            this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: token, apiStatus: 'success', apiCodeStatus: 200}}))
            return LOGIN_SUCCESS({ token })
          }),
          catchError((error) => {
            if (error.statusText === "Unknown Error") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Ocurrió un error con el servidor, intente de nuevo, en caso de persistir, comuniquese con el personal de sistemas", apiStatus: 'error', apiCodeStatus: error.status}}))
              throw error;
            } else if (error.statusText === "Unauthorized") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Su token de sesión expiró o es inválido. Inicie nuevamente sesión.", apiStatus: 'error', apiCodeStatus: error.status}}))
              throw error;
            } else {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: error.error.message, apiStatus: 'error', apiCodeStatus: error.status}}))
              throw error;
            }
          })
        )
      }),
    )
  ); */
};
