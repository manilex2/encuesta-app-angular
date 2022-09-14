import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, exhaustMap } from 'rxjs';
import { TipoEncuestaService } from '../../services/tipo-encuesta.service';
import { GET_TIPOS_ENCUESTA, GET_TIPOS_ENCUESTA_ERROR, GET_TIPOS_ENCUESTA_SUCCESS } from '../actions/tiposencuesta.actions';

@Injectable()
export class TiposEncuestaEffect {
  constructor(
    private actions$: Actions,
    private tipoEncuestaService: TipoEncuestaService,
  ) {}

  loadAllTiposEncuesta$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GET_TIPOS_ENCUESTA),
      exhaustMap((initAction) => {
        return this.tipoEncuestaService.obtenerTiposEncuestas().pipe(
          map(tipos_encuesta => GET_TIPOS_ENCUESTA_SUCCESS({tipos_encuesta})),
          catchError(() => of(GET_TIPOS_ENCUESTA_ERROR({error: "Ha ocurrido un error al obtener los tipos de encuesta"}))),
        );
      })
    )
  )
};
