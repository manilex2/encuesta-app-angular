import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from "@ngrx/store";
import { catchError, map, of, exhaustMap, concatMap, withLatestFrom, EMPTY, tap, switchMap, mergeMap } from 'rxjs';
import { Appstate } from "../../../shared/store/AppState";
import { AdminService } from '../../services/admin.service';
import {
  GET_ADMINS,
  GET_ADMINS_SUCCESS,
  CREATE_ADMIN,
  CREATE_ADMIN_SUCCESS,
  UPDATE_ADMIN,
  UPDATE_ADMIN_SUCCESS,
  DELETE_ADMIN,
  DELETE_ADMIN_SUCCESS,
  RESET_ADMINS,
} from '../actions/admin.actions';
import { setAPIStatus } from "../../../shared/store/actions/app.actions";
import { selectAdmins } from "../selectors/admin.selectors";
import { selectAppState } from "src/app/shared/store/selectors/app.selectors";

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
        let loginStatus: any;
        let token = localStorage.getItem('auth_token');
        this.appStore.pipe(select(selectAppState)).subscribe(data => loginStatus = data.loginStatus);
        if (loginStatus === "logout" && !token) {
          return EMPTY;
        } else {
          this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: '', apiCodeStatus: 200, loginStatus: "logged"}}))
        }
        if (adminsFromStore.length > 0) {
          this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: '', apiCodeStatus: 200, adminState: "done"}}))
          return EMPTY;
        }
        return this.adminService.obtenerTodosAdmins().pipe(
          map(admins => {
            this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: 'success', apiCodeStatus: 200, adminState: 'getted'}}))
            return GET_ADMINS_SUCCESS({ admins })
          }),
          catchError((error) => {
            if (error.statusText === "Unknown Error") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Ocurri?? un error con el servidor, intente de nuevo, en caso de persistir, comuniquese con el personal de sistemas", apiStatus: 'error', apiCodeStatus: error.status, adminState: "gettedError"}}))
              throw error;
            } else if (error.statusText === "Unauthorized") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Su token de sesi??n expir?? o es inv??lido. Inicie nuevamente sesi??n.", apiStatus: 'error', apiCodeStatus: error.status, adminState: "gettedError"}}))
              throw error;
            } else {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: error.error.message, apiStatus: 'error', apiCodeStatus: error.status, adminState: "gettedError"}}))
              throw error;
            }
          })
        );
      })
    )
  );

  createAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CREATE_ADMIN),
      concatMap((action) => {
        this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: '', apiCodeStatus: 200}}))
        return this.adminService.crearAdmin(action.newAdmin).pipe(
          map(newAdmin => {
            this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: 'success', apiCodeStatus: 200, adminState: "created"}}))
            return CREATE_ADMIN_SUCCESS({ newAdmin })
          }),
          catchError((error) => {
            if (error.statusText === "Unknown Error") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Ocurri?? un error con el servidor, intente de nuevo, en caso de persistir, comuniquese con el personal de sistemas", apiStatus: 'error', apiCodeStatus: error.status, adminState: "createdError"}}))
              throw error;
            } else if (error.statusText === "Unauthorized") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Su token de sesi??n expir?? o es inv??lido. Inicie nuevamente sesi??n.", apiStatus: 'error', apiCodeStatus: error.status, adminState: "createdError"}}))
              throw error;
            } else {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: error.error.message, apiStatus: 'error', apiCodeStatus: error.status, adminState: "createdError"}}))
              throw error;
            }
          })
        )
      }),
    )
  );

  updateAdmin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UPDATE_ADMIN),
      concatMap((action) => {
        this.appStore.dispatch(setAPIStatus({ apiStatus: { apiCodeStatus: 200, apiResponseMessage: "", apiStatus: "" } }));
        return this.adminService.actualizarAdmin(action.updateAdmin, action.codigo).pipe(
          map((updateAdmin) => {
            this.appStore.dispatch(setAPIStatus({ apiStatus: { apiCodeStatus: 200, apiResponseMessage: "", apiStatus: "success", adminState: "updated" } }));
            return UPDATE_ADMIN_SUCCESS({ updateAdmin });
          }),
          catchError((error) => {
            if (error.statusText === "Unknown Error") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Ocurri?? un error con el servidor, intente de nuevo, en caso de persistir, comuniquese con el personal de sistemas", apiStatus: 'error', apiCodeStatus: error.status, adminState: "updatedError"}}))
              throw error;
            } else if (error.statusText === "Unauthorized") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Su token de sesi??n expir?? o es inv??lido. Inicie nuevamente sesi??n.", apiStatus: 'error', apiCodeStatus: error.status, adminState: "updatedError"}}))
              throw error;
            } else {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: error.error.message, apiStatus: 'error', apiCodeStatus: error.status, adminState: "updatedError"}}))
              throw error;
            }
          })
        );
      })
    );
  });

  deleteAdmin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DELETE_ADMIN),
      mergeMap((actions) => {
        this.appStore.dispatch(setAPIStatus({ apiStatus: { apiCodeStatus: 200, apiResponseMessage: "", apiStatus: "" } }));
        return this.adminService.eliminarAdmin(actions.codigo).pipe(
          map((deleteAdmin) => {
            this.appStore.dispatch(setAPIStatus({ apiStatus: { apiCodeStatus: 200, apiResponseMessage: "", apiStatus: "success", adminState: "deleted" } }));
            return DELETE_ADMIN_SUCCESS({ deleteAdmin });
          }),
          catchError((error) => {
            if (error.statusText === "Unknown Error") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Ocurri?? un error con el servidor, intente de nuevo, en caso de persistir, comuniquese con el personal de sistemas", apiStatus: 'error', apiCodeStatus: error.status, adminState: "deletedError"}}))
              throw error;
            } else if (error.statusText === "Unauthorized") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Su token de sesi??n expir?? o es inv??lido. Inicie nuevamente sesi??n.", apiStatus: 'error', apiCodeStatus: error.status, adminState: "deletedError"}}))
              throw error;
            } else {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: error.error.message, apiStatus: 'error', apiCodeStatus: error.status, adminState: "deletedError"}}))
              throw error;
            }
          })
        );
      })
    );
  });
  resetAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RESET_ADMINS),
      tap((state) => {
        return state.type
      })
    ), {dispatch: false}
  )
};
