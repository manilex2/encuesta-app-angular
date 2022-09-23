import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from "@ngrx/store";
import { catchError, map, exhaustMap, withLatestFrom, EMPTY } from 'rxjs';
import { setAPIStatus } from "src/app/shared/store/actions/app.actions";
import { Appstate } from "src/app/shared/store/AppState";
import { TipoEncuestaService } from '../../services/tipo-encuesta.service';
import { GET_TIPOS_ENCUESTA, GET_TIPOS_ENCUESTA_SUCCESS } from '../actions/tiposencuesta.actions';
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
        this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: '', apiCodeStatus: 200}}))
        if (tiposEncuestaFromStore.length > 0) {
          return EMPTY;
        }
        return this.tipoEncuestaService.obtenerTiposEncuestas().pipe(
          map(tipos_encuesta => {
            this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: 'success', apiCodeStatus: 200}}))
            return GET_TIPOS_ENCUESTA_SUCCESS({ tipos_encuesta })
          }),
          catchError((error) => {
            this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: error.error.message, apiStatus: 'error', apiCodeStatus: error.status}}))
            throw error;
          }),
        );
      })
    )
  )
};
