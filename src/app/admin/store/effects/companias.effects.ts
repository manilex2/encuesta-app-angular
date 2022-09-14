import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, exhaustMap } from 'rxjs';
import { CompaniaService } from '../../services/compania.service';
import { GET_COMPANIAS, GET_COMPANIAS_ERROR, GET_COMPANIAS_SUCCESS } from '../actions/companias.actions';

@Injectable()
export class CompaniasEffect {
  constructor(
    private actions$: Actions,
    private companiaService: CompaniaService,
  ) {}

  loadAllCompanias$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GET_COMPANIAS),
      exhaustMap((initAction) => {
        return this.companiaService.obtenerTodasCompanias().pipe(
          map(companias => GET_COMPANIAS_SUCCESS({companias})),
          catchError(() => of(GET_COMPANIAS_ERROR({error: "Ha ocurrido un error al obtener las compañías"}))),
        );
      })
    )
  )
};
