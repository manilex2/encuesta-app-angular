import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from "@ngrx/store";
import { catchError, map, concatMap, tap, withLatestFrom, EMPTY, exhaustMap } from 'rxjs';
import { Appstate } from "../../../shared/store/AppState";
import { AuthService } from '../../services/auth.service';
import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGOUT,
  RESET_LOGIN
} from '../actions/login.actions';
import { setAPIStatus } from "../../../shared/store/actions/app.actions";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { selectUser } from "../selectors/login.selectors";
import { Admin, Compania, CurrentUser, TiposEncuesta } from "src/app/admin/components/models";
import { RESET_ADMINS } from "src/app/admin/store/actions/admin.actions";
import { RESET_COMPANIAS } from "src/app/admin/store/actions/companias.actions";
import { RESET_TIPOS_ENCUESTAS } from "src/app/admin/store/actions/tiposencuesta.actions";
import { RESET_CURRENT_USER } from "src/app/admin/store/actions/currentuser.actions";
import { RESET_ENCUESTAS } from "src/app/admin/store/actions/encuesta.actions";
import { User } from "../../components/models";

@Injectable()
export class LoginEffect {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private appStore: Store<Appstate>,
    private router: Router,
    private toastr: ToastrService,
    private store: Store,
    private adminStore: Store<Admin[]>,
    private companiaStore: Store<Compania[]>,
    private tipoEncuestaStore: Store<TiposEncuesta[]>,
    private currentUserStore: Store<CurrentUser>,
    private loginStore: Store<User[]>
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOGIN),
      withLatestFrom(this.store.pipe(select(selectUser))),
      concatMap(([action, loginFromStore]) => {
        if (loginFromStore.length > 0) {
          this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: '', apiCodeStatus: 200, loginStatus: 'logged'}}))
        }
        return this.authService.login(action.user).pipe(
          map(users => {
            this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: 'success', apiCodeStatus: 200, loginStatus: "login"}}))
            return LOGIN_SUCCESS({ users })
          }),
          catchError((error) => {
            if (error.statusText === "Unknown Error") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Ocurrió un error con el servidor, intente de nuevo, en caso de persistir, comuniquese con el personal de sistemas", apiStatus: 'error', apiCodeStatus: error.status}}))
              throw error;
            } else if (error.statusText === "Unauthorized") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Su token de sesión expiró o es inválido. Inicie nuevamente sesión.", apiStatus: 'error', apiCodeStatus: error.status}}))
              throw error;
            } else if (error.statusText === "Forbidden") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: error.error.message, apiStatus: 'error', apiCodeStatus: error.status}}))
              throw error;
            } else {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: error.error.message, apiStatus: 'error', apiCodeStatus: error.status}}))
              throw error;
            }
          })
        )
      }),
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOGOUT),
      tap(() => {
        this.toastr.info("Cerrada la sesión, Hasta pronto.", "Login", {
          progressBar: true,
          timeOut: 3000,
          positionClass: "toast-top-center"
        })
        this.adminStore.dispatch(RESET_ADMINS());
        this.companiaStore.dispatch(RESET_COMPANIAS());
        this.tipoEncuestaStore.dispatch(RESET_TIPOS_ENCUESTAS());
        this.tipoEncuestaStore.dispatch(RESET_ENCUESTAS());
        this.currentUserStore.dispatch(RESET_CURRENT_USER());
        this.loginStore.dispatch(RESET_LOGIN());
        this.appStore.dispatch(setAPIStatus({
          apiStatus: {
            apiCodeStatus: 200,
            apiResponseMessage: "",
            apiStatus: "",
            loginStatus: "logout",
            adminState: "",
            companiaState: "",
            tiposEncuestaState: "",
            encuestaState: "",
            responseState: ""
          }
        }));
        localStorage.removeItem('auth_token');
        this.router.navigate(['auth']);
      })
    ), {dispatch: false}
  )
}
