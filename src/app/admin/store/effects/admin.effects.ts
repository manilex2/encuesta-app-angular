import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from "@ngrx/store";
import { catchError, map, of, exhaustMap, concatMap, withLatestFrom, EMPTY } from 'rxjs';
import { Appstate } from "../../../shared/store/AppState";
import { AdminService } from '../../services/admin.service';
import {
  GET_ADMINS,
  GET_ADMINS_SUCCESS,
  CREATE_ADMIN,
  CREATE_ADMIN_SUCCESS,
} from '../actions/admin.actions';
import { setAPIStatus } from "../../../shared/store/actions/app.actions";
import { selectAdmins } from "../selectors/admin.selectors";

@Injectable()
export class AdminsEffect {
  constructor(
    private actions$: Actions,
    private adminService: AdminService,
    private appStore: Store<Appstate>,
    private store: Store
  ) {}

  loadAllAdmins$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GET_ADMINS),
      withLatestFrom(this.store.pipe(select(selectAdmins))),
      exhaustMap(([, adminsFromStore]) => {
        this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: '', apiCodeStatus: 200}}))
        if (adminsFromStore.length > 0) {
          this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: 'success', apiCodeStatus: 200}}))
          return EMPTY;
        }
        return this.adminService.obtenerTodosAdmins().pipe(
          map(admins => {
            this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: 'success', apiCodeStatus: 200}}))
            return GET_ADMINS_SUCCESS({ admins })
          }),
          catchError((error) => {
            this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: error.error.message, apiStatus: 'error', apiCodeStatus: error.status}}))
            throw error;
          }),
        );
      })
    )
  );

  createAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CREATE_ADMIN),
      concatMap((action) => {
        this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: '', apiCodeStatus: 200}}))
        return this.adminService.crearAdmin(action.newUser).pipe(
          map(newUser => {
            this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: 'success', apiCodeStatus: 200}}))
            return CREATE_ADMIN_SUCCESS({ newUser })
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
  );
};
