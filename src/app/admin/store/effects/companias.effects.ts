import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from "@ngrx/store";
import { catchError, map, of, exhaustMap, withLatestFrom, EMPTY } from 'rxjs';
import { setAPIStatus } from "src/app/shared/store/actions/app.actions";
import { Appstate } from "src/app/shared/store/AppState";
import { CompaniaService } from '../../services/compania.service';
import { GET_COMPANIAS, GET_COMPANIAS_SUCCESS } from '../actions/companias.actions';
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
        this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: '', apiCodeStatus: 200}}))
        if (companiasFromStore.length > 0) {
          this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: 'success', apiCodeStatus: 200}}))
          return EMPTY;
        }
        return this.companiaService.obtenerTodasCompanias().pipe(
          map(companias => {
            this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: 'success', apiCodeStatus: 200}}))
            return GET_COMPANIAS_SUCCESS({ companias })
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
