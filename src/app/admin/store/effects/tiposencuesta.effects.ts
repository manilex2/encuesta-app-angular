import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from "@ngrx/store";
import { catchError, map, exhaustMap, withLatestFrom, EMPTY, concatMap, mergeMap } from 'rxjs';
import { setAPIStatus } from "src/app/shared/store/actions/app.actions";
import { Appstate } from "src/app/shared/store/AppState";
import { selectAppState } from "src/app/shared/store/selectors/app.selectors";
import { TipoEncuestaService } from '../../services/tipo-encuesta.service';
import { CREATE_TIPOS_ENCUESTA, CREATE_TIPOS_ENCUESTA_SUCCESS, DELETE_TIPOS_ENCUESTA, DELETE_TIPOS_ENCUESTA_SUCCESS, GET_TIPOS_ENCUESTA, GET_TIPOS_ENCUESTA_SUCCESS, UPDATE_TIPOS_ENCUESTA, UPDATE_TIPOS_ENCUESTA_SUCCESS } from '../actions/tiposencuesta.actions';
import { selectTiposEncuesta } from "../selectors/tiposencuesta.selectors";

@Injectable()
export class TiposEncuestaEffect {
  constructor(
    private actions$: Actions,
    private tipoEncuestaService: TipoEncuestaService,
    private appStore: Store<Appstate>,
    private store: Store
  ) {}

  loadAllTiposEncuesta$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GET_TIPOS_ENCUESTA),
      withLatestFrom(this.store.pipe(select(selectTiposEncuesta))),
      exhaustMap(([, tiposEncuestaFromStore]) => {
        let loginStatus: any;
        let token = localStorage.getItem('auth_token');
        this.appStore.pipe(select(selectAppState)).subscribe(data => loginStatus = data.loginStatus);
        if (loginStatus === "logout" && !token) {
          return EMPTY;
        } else {
          this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: '', apiCodeStatus: 200, loginStatus: "logged"}}))
        }
        if (tiposEncuestaFromStore.length > 0) {
          this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: '', apiCodeStatus: 200, tiposEncuestaState: "done"}}))
          return EMPTY;
        }
        return this.tipoEncuestaService.obtenerTiposEncuestas().pipe(
          map(tipos_encuesta => {
            this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: 'success', apiCodeStatus: 200, tiposEncuestaState: 'getted'}}))
            return GET_TIPOS_ENCUESTA_SUCCESS({ tipos_encuesta })
          }),
          catchError((error) => {
            if (error.statusText === "Unknown Error") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Ocurrió un error con el servidor, intente de nuevo, en caso de persistir, comuniquese con el personal de sistemas", apiStatus: 'error', apiCodeStatus: error.status, tiposEncuestaState: "gettedError"}}))
              throw error;
            } else if (error.statusText === "Unauthorized") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Su token de sesión expiró o es inválido. Inicie nuevamente sesión.", apiStatus: 'error', apiCodeStatus: error.status, tiposEncuestaState: "gettedError"}}))
              throw error;
            } else {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: error.error.message, apiStatus: 'error', apiCodeStatus: error.status, tiposEncuestaState: "gettedError"}}))
              throw error;
            }
          })
        );
      })
    )
  );

  createTipoEncuesta$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CREATE_TIPOS_ENCUESTA),
      concatMap((action) => {
        this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: '', apiCodeStatus: 200}}))
        return this.tipoEncuestaService.crearTipoEncuesta(action.newTipoEncuesta).pipe(
          map(newTipoEncuesta => {
            this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: 'success', apiCodeStatus: 200, tiposEncuestaState: "created"}}))
            return CREATE_TIPOS_ENCUESTA_SUCCESS({ newTipoEncuesta })
          }),
          catchError((error) => {
            if (error.statusText === "Unknown Error") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Ocurrió un error con el servidor, intente de nuevo, en caso de persistir, comuniquese con el personal de sistemas", apiStatus: 'error', apiCodeStatus: error.status, tiposEncuestaState: "createdError"}}))
              throw error;
            } else if (error.statusText === "Unauthorized") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Su token de sesión expiró o es inválido. Inicie nuevamente sesión.", apiStatus: 'error', apiCodeStatus: error.status, tiposEncuestaState: "createdError"}}))
              throw error;
            } else {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: error.error.message, apiStatus: 'error', apiCodeStatus: error.status, tiposEncuestaState: "createdError"}}))
              throw error;
            }
          })
        )
      }),
    )
  );

  updateTipoEncuesta$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UPDATE_TIPOS_ENCUESTA),
      concatMap((action) => {
        this.appStore.dispatch(setAPIStatus({ apiStatus: { apiCodeStatus: 200, apiResponseMessage: "", apiStatus: "" } }));
        return this.tipoEncuestaService.actualizarTipoEncuesta(action.updateTipoEncuesta, action.codigo, action.identificador).pipe(
          map((updateTipoEncuesta) => {
            console.log(updateTipoEncuesta);
            this.appStore.dispatch(setAPIStatus({ apiStatus: { apiCodeStatus: 200, apiResponseMessage: "", apiStatus: "success", tiposEncuestaState: "updated" } }));
            return UPDATE_TIPOS_ENCUESTA_SUCCESS({ updateTipoEncuesta });
          }),
          catchError((error) => {
            if (error.statusText === "Unknown Error") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Ocurrió un error con el servidor, intente de nuevo, en caso de persistir, comuniquese con el personal de sistemas", apiStatus: 'error', apiCodeStatus: error.status, tiposEncuestaState: "updatedError"}}))
              throw error;
            } else if (error.statusText === "Unauthorized") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Su token de sesión expiró o es inválido. Inicie nuevamente sesión.", apiStatus: 'error', apiCodeStatus: error.status, tiposEncuestaState: "updatedError"}}))
              throw error;
            } else {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: error.error.message, apiStatus: 'error', apiCodeStatus: error.status, tiposEncuestaState: "updatedError"}}))
              throw error;
            }
          })
        );
      })
    );
  });

  deleteTipoEncuesta$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DELETE_TIPOS_ENCUESTA),
      mergeMap((actions) => {
        this.appStore.dispatch(setAPIStatus({ apiStatus: { apiCodeStatus: 200, apiResponseMessage: "", apiStatus: "" } }));
        return this.tipoEncuestaService.eliminarTipoEncuesta(actions.codigo, actions.identificador).pipe(
          map((deleteTipoEncuesta) => {
            this.appStore.dispatch(setAPIStatus({ apiStatus: { apiCodeStatus: 200, apiResponseMessage: "", apiStatus: "success", tiposEncuestaState: "deleted" } }));
            return DELETE_TIPOS_ENCUESTA_SUCCESS({ deleteTipoEncuesta });
          }),
          catchError((error) => {
            if (error.statusText === "Unknown Error") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Ocurrió un error con el servidor, intente de nuevo, en caso de persistir, comuniquese con el personal de sistemas", apiStatus: 'error', apiCodeStatus: error.status, tiposEncuestaState: "deletedError"}}))
              throw error;
            } else if (error.statusText === "Unauthorized") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Su token de sesión expiró o es inválido. Inicie nuevamente sesión.", apiStatus: 'error', apiCodeStatus: error.status, tiposEncuestaState: "deletedError"}}))
              throw error;
            } else {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: error.error.message, apiStatus: 'error', apiCodeStatus: error.status, tiposEncuestaState: "deletedError"}}))
              throw error;
            }
          })
        );
      })
    );
  });
};
