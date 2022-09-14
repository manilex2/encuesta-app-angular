import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CompaniasState, companiasFeatureKey } from '../reducers/companias.reducers';

export const selectCompanias = createFeatureSelector<CompaniasState>(companiasFeatureKey);

export const companias = createSelector(
  selectCompanias,
  (selectCompanias) => selectCompanias.companias
)
