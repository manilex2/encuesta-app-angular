import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TiposEncuestaState, tiposEncuestaFeatureKey } from '../reducers/tiposencuesta.reducers';

export const selectTiposEncuesta = createFeatureSelector<TiposEncuestaState>(tiposEncuestaFeatureKey);

export const tipos_encuesta = createSelector(
  selectTiposEncuesta,
  (selectTiposEncuesta) => selectTiposEncuesta.tipos_encuesta
)
