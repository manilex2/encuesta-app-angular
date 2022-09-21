import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Compania } from '../../components/models';
import { companiasFeatureKey } from '../reducers/companias.reducers';

export const selectCompanias = createFeatureSelector<Compania[]>(companiasFeatureKey);

export const companias = createSelector(
  selectCompanias,
  (selectCompanias) => selectCompanias
)
