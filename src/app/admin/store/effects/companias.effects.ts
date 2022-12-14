import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from "@ngrx/store";
import { catchError, map, of, exhaustMap, withLatestFrom, EMPTY, concatMap, mergeMap } from 'rxjs';
import { setAPIStatus } from "src/app/shared/store/actions/app.actions";
import { Appstate } from "src/app/shared/store/AppState";
import { selectAppState } from "src/app/shared/store/selectors/app.selectors";
import { CompaniaService } from '../../services/compania.service';
import { CREATE_COMPANIA, CREATE_COMPANIA_SUCCESS, DELETE_COMPANIA, DELETE_COMPANIA_SUCCESS, GET_COMPANIAS, GET_COMPANIAS_SUCCESS, UPDATE_COMPANIA, UPDATE_COMPANIA_SUCCESS } from '../actions/companias.actions';
import { selectCompanias } from "../selectors/companias.selectors";

@Injectable()
export class CompaniasEffect {
  constructor(
    private actions$: Actions,
    private companiaService: CompaniaService,
    private appStore: Store<Appstate>,
    private store: Store
  ) {}

  loadAllCompanias$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GET_COMPANIAS),
      withLatestFrom(this.store.pipe(select(selectCompanias))),
      exhaustMap(([, companiasFromStore]) => {
        let loginStatus: any;
        let token = localStorage.getItem('auth_token');
        this.appStore.pipe(select(selectAppState)).subscribe(data => loginStatus = data.loginStatus);
        if (loginStatus === "logout" && !token) {
          return EMPTY;
        } else {
          this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: '', apiCodeStatus: 200, loginStatus: "logged"}}))
        }
        if (companiasFromStore.length > 0) {
          this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: '', apiCodeStatus: 200, companiaState: "done"}}))
          return EMPTY;
        }
        return this.companiaService.obtenerTodasCompanias().pipe(
          map(companias => {
            this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: 'success', apiCodeStatus: 200, companiaState: 'getted'}}))
            return GET_COMPANIAS_SUCCESS({ companias })
          }),
          catchError((error) => {
            if (error.statusText === "Unknown Error") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Ocurri?? un error con el servidor, intente de nuevo, en caso de persistir, comuniquese con el personal de sistemas", apiStatus: 'error', apiCodeStatus: error.status, companiaState: "gettedError"}}))
              throw error;
            } else if (error.statusText === "Unauthorized") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Su token de sesi??n expir?? o es inv??lido. Inicie nuevamente sesi??n.", apiStatus: 'error', apiCodeStatus: error.status, companiaState: "gettedError"}}))
              throw error;
            } else {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: error.error.message, apiStatus: 'error', apiCodeStatus: error.status, companiaState: "gettedError"}}))
              throw error;
            }
          })
        );
      })
    )
  );

  createCompania$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CREATE_COMPANIA),
      concatMap((action) => {
        this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: '', apiCodeStatus: 200}}))
        return this.companiaService.crearCompania(action.newCompania).pipe(
          map(newCompania => {
            this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: 'success', apiCodeStatus: 200, companiaState: "created"}}))
            return CREATE_COMPANIA_SUCCESS({ newCompania })
          }),
          catchError((error) => {
            if (error.statusText === "Unknown Error") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Ocurri?? un error con el servidor, intente de nuevo, en caso de persistir, comuniquese con el personal de sistemas", apiStatus: 'error', apiCodeStatus: error.status, companiaState: "createdError"}}))
              throw error;
            } else if (error.statusText === "Unauthorized") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Su token de sesi??n expir?? o es inv??lido. Inicie nuevamente sesi??n.", apiStatus: 'error', apiCodeStatus: error.status, companiaState: "createdError"}}))
              throw error;
            } else {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: error.error.message, apiStatus: 'error', apiCodeStatus: error.status, companiaState: "createdError"}}))
              throw error;
            }
          })
        )
      }),
    )
  );

  updateCompania$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UPDATE_COMPANIA),
      concatMap((action) => {
        this.appStore.dispatch(setAPIStatus({ apiStatus: { apiCodeStatus: 200, apiResponseMessage: "", apiStatus: "" } }));
        return this.companiaService.actualizarCompania(action.updateCompania, action.codigo, action.codigo_cia).pipe(
          map((updateCompania) => {
            this.appStore.dispatch(setAPIStatus({ apiStatus: { apiCodeStatus: 200, apiResponseMessage: "", apiStatus: "success", companiaState: "updated" } }));
            return UPDATE_COMPANIA_SUCCESS({ updateCompania });
          }),
          catchError((error) => {
            if (error.statusText === "Unknown Error") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Ocurri?? un error con el servidor, intente de nuevo, en caso de persistir, comuniquese con el personal de sistemas", apiStatus: 'error', apiCodeStatus: error.status, companiaState: "updatedError"}}))
              throw error;
            } else if (error.statusText === "Unauthorized") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Su token de sesi??n expir?? o es inv??lido. Inicie nuevamente sesi??n.", apiStatus: 'error', apiCodeStatus: error.status, companiaState: "updatedError"}}))
              throw error;
            } else {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: error.error.message, apiStatus: 'error', apiCodeStatus: error.status, companiaState: "updatedError"}}))
              throw error;
            }
          })
        );
      })
    );
  });

  deleteCompania$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DELETE_COMPANIA),
      mergeMap((actions) => {
        this.appStore.dispatch(setAPIStatus({ apiStatus: { apiCodeStatus: 200, apiResponseMessage: "", apiStatus: "" } }));
        return this.companiaService.eliminarCompania(actions.codigo, actions.codigo_cia).pipe(
          map((deleteCompania) => {
            this.appStore.dispatch(setAPIStatus({ apiStatus: { apiCodeStatus: 200, apiResponseMessage: "", apiStatus: "success", companiaState: "deleted" } }));
            return DELETE_COMPANIA_SUCCESS({ deleteCompania });
          }),
          catchError((error) => {
            if (error.statusText === "Unknown Error") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Ocurri?? un error con el servidor, intente de nuevo, en caso de persistir, comuniquese con el personal de sistemas", apiStatus: 'error', apiCodeStatus: error.status, companiaState: "deletedError"}}))
              throw error;
            } else if (error.statusText === "Unauthorized") {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: "Su token de sesi??n expir?? o es inv??lido. Inicie nuevamente sesi??n.", apiStatus: 'error', apiCodeStatus: error.status, companiaState: "deletedError"}}))
              throw error;
            } else {
              this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: error.error.message, apiStatus: 'error', apiCodeStatus: error.status, companiaState: "deletedError"}}))
              throw error;
            }
          })
        );
      })
    );
  });
};
