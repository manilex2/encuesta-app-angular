import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Compania } from '../../components/models';
import { companiasFeatureKey } from '../reducers/companias.reducers';

export const selectCompanias = createFeatureSelector<Compania[]>(companiasFeatureKey);

export const companias = createSelector(
  selectCompanias,
  (selectCompanias) => selectCompanias
)

export const selectCompaniaById = (adminCodigo: string, companiaCodigo: string) =>
  createSelector(selectCompanias, (companias: Compania[]) => {
    var companiaById = companias.filter((_) => (_.codigo_cia == companiaCodigo && _.codigo == adminCodigo));
    if (companiaById.length == 0) {
      return null;
    }
    return companiaById[0];
});
