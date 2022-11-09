import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from "@ngrx/store";
import { catchError, map, exhaustMap, withLatestFrom, EMPTY, concatMap, mergeMap } from 'rxjs';
import { setAPIStatus } from "src/app/shared/store/actions/app.actions";
import { Appstate } from "src/app/shared/store/AppState";
import { selectAppState } from "src/app/shared/store/selectors/app.selectors";
import { EncuestaService } from '../../services/encuesta.service';
import {
  CREATE_ENCUESTA,
  CREATE_ENCUESTA_SUCCESS,
  DELETE_ENCUESTA,
  DELETE_ENCUESTA_SUCCESS,
  GET_ENCUESTA,
  GET_ENCUESTA_SUCCESS,
  UPDATE_ENCUESTA,
  UPDATE_ENCUESTA_SUCCESS
} from '../actions/encuesta.actions';
import { selectEncuesta } from "../selectors/encuesta.selectors";

@Injectable()
export class EncuestaEffect {
  constructor(
    private actions$: Actions,
    private encuestaService: EncuestaService,
    private appStore: Store<Appstate>,
    private store: Store
  ) {}

  loadAllEncuestas$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GET_ENCUESTA),
      withLatestFrom(this.store.pipe(select(selectEncuesta))),
      exhaustMap(([, encuestaFromStore]) => {
        let loginStatus: any;
        let token = localStorage.getItem('auth_token');
        this.appStore.pipe(select(selectAppState)).subscribe(data => loginStatus = data.loginStatus);
        if (loginStatus === "logout" && !token) {
          return EMPTY;
        } else {
          this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: '', apiCodeStatus: 200, loginStatus: "logged"}}))
        }
        if (encuestaFromStore.length > 0) {
          this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: '', apiCodeStatus: 200, encuestaState: "done"}}))
          return EMPTY;
        }
        return this.encuestaService.obtenerEncuestas().pipe(
          map(encuesta => {
            this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: 'success', apiCodeStatus: 200, encuestaState: 'getted'}}))
            return GET_ENCUESTA_SUCCESS({ encuesta })
          }),
          catchError((error) => {
            if (error.statusText === "Unknown Error") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Ocurrió un error con el servidor, intente de nuevo, en caso de persistir, comuniquese con el personal de sistemas", apiStatus: 'error', apiCodeStatus: error.status, encuestaState: "gettedError"}}))
              throw error;
            } else if (error.statusText === "Unauthorized") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Su token de sesión expiró o es inválido. Inicie nuevamente sesión.", apiStatus: 'error', apiCodeStatus: error.status, encuestaState: "gettedError"}}))
              throw error;
            } else {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: error.error.message, apiStatus: 'error', apiCodeStatus: error.status, encuestaState: "gettedError"}}))
              throw error;
            }
          })
        );
      })
    )
  );

  createEncuesta$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CREATE_ENCUESTA),
      concatMap((action) => {
        this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: '', apiCodeStatus: 200}}))
        return this.encuestaService.crearEncuesta(action.newEncuesta).pipe(
          map(newEncuesta => {
            this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: 'success', apiCodeStatus: 200, encuestaState: "created"}}))
            return CREATE_ENCUESTA_SUCCESS({ newEncuesta })
          }),
          catchError((error) => {
            if (error.statusText === "Unknown Error") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Ocurrió un error con el servidor, intente de nuevo, en caso de persistir, comuniquese con el personal de sistemas", apiStatus: 'error', apiCodeStatus: error.status, encuestaState: "createdError"}}))
              throw error;
            } else if (error.statusText === "Unauthorized") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Su token de sesión expiró o es inválido. Inicie nuevamente sesión.", apiStatus: 'error', apiCodeStatus: error.status, encuestaState: "createdError"}}))
              throw error;
            } else {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: error.error.message, apiStatus: 'error', apiCodeStatus: error.status, encuestaState: "createdError"}}))
              throw error;
            }
          })
        )
      }),
    )
  );

  updateEncuesta$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UPDATE_ENCUESTA),
      concatMap((action) => {
        this.appStore.dispatch(setAPIStatus({ apiStatus: { apiCodeStatus: 200, apiResponseMessage: "", apiStatus: "" } }));
        return this.encuestaService.actualizarEncuesta(action.updateEncuesta, action.codigo, action.codigo_cia, action.identificador, action.numero).pipe(
          map((updateEncuesta) => {
            this.appStore.dispatch(setAPIStatus({ apiStatus: { apiCodeStatus: 200, apiResponseMessage: "", apiStatus: "success", encuestaState: "updated" } }));
            return UPDATE_ENCUESTA_SUCCESS({ updateEncuesta });
          }),
          catchError((error) => {
            if (error.statusText === "Unknown Error") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Ocurrió un error con el servidor, intente de nuevo, en caso de persistir, comuniquese con el personal de sistemas", apiStatus: 'error', apiCodeStatus: error.status, encuestaState: "updatedError"}}))
              throw error;
            } else if (error.statusText === "Unauthorized") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Su token de sesión expiró o es inválido. Inicie nuevamente sesión.", apiStatus: 'error', apiCodeStatus: error.status, encuestaState: "updatedError"}}))
              throw error;
            } else {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: error.error.message, apiStatus: 'error', apiCodeStatus: error.status, encuestaState: "updatedError"}}))
              throw error;
            }
          })
        );
      })
    );
  });

  deleteEncuesta$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DELETE_ENCUESTA),
      mergeMap((actions) => {
        this.appStore.dispatch(setAPIStatus({ apiStatus: { apiCodeStatus: 200, apiResponseMessage: "", apiStatus: "" } }));
        return this.encuestaService.eliminarEncuesta(actions.codigo, actions.codigo_cia, actions.identificador, actions.numero).pipe(
          map((deleteEncuesta) => {
            this.appStore.dispatch(setAPIStatus({ apiStatus: { apiCodeStatus: 200, apiResponseMessage: "", apiStatus: "success", encuestaState: "deleted" } }));
            return DELETE_ENCUESTA_SUCCESS({ deleteEncuesta });
          }),
          catchError((error) => {
            if (error.statusText === "Unknown Error") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Ocurrió un error con el servidor, intente de nuevo, en caso de persistir, comuniquese con el personal de sistemas", apiStatus: 'error', apiCodeStatus: error.status, encuestaState: "deletedError"}}))
              throw error;
            } else if (error.statusText === "Unauthorized") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Su token de sesión expiró o es inválido. Inicie nuevamente sesión.", apiStatus: 'error', apiCodeStatus: error.status, encuestaState: "deletedError"}}))
              throw error;
            } else {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: error.error.message, apiStatus: 'error', apiCodeStatus: error.status, encuestaState: "deletedError"}}))
              throw error;
            }
          })
        );
      })
    );
  });
};
