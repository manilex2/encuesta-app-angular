import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TiposEncuesta } from '../../components/models';
import { tiposEncuestaFeatureKey } from '../reducers/tiposencuesta.reducers';

export const selectTiposEncuesta = createFeatureSelector<TiposEncuesta[]>(tiposEncuestaFeatureKey);

export const tipos_encuesta = createSelector(
  selectTiposEncuesta,
  (selectTiposEncuesta) => selectTiposEncuesta
)
