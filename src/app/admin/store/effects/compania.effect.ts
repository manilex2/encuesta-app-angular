import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { EMPTY, map, mergeMap, take, tap, withLatestFrom } from 'rxjs';
import { CompaniaService } from '../../services/compania.service';
import { companiasGET, companiasGETSuccess } from '../actions/compania.action';
import { selectCompanias } from '../selectors/compania.selector';

@Injectable()
export class CompaniasEffect {
  constructor(
    private actions$: Actions,
    private companiaService: CompaniaService,
    private store: Store
  ) {}

  loadAllCompanias$ = createEffect(() =>
    this.actions$.pipe(
      ofType(companiasGET),
      withLatestFrom(this.store.pipe(select(selectCompanias))),
      take(1),
      mergeMap(([, companiasStore]) => {
        if (companiasStore.length > 0) {
          return EMPTY;
        }
        return this.companiaService
          .obtenerTodasCompanias()
          .pipe(map((data) => companiasGETSuccess({ companias: data })));
      })
    )
  );
}
