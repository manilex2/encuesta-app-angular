import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Response } from '../../components/models';
import { responseFeatureKey } from '../reducers/response.reducers';

export const selectResponse = createFeatureSelector<Response[]>(responseFeatureKey);

export const response = createSelector(
  selectResponse,
  (selectResponse) => selectResponse
);

export const selectResponseById = (adminCodigo: string, codigo_cia: string, identificador: string) =>
  createSelector(selectResponse, (response: Response[]) => {
    var tipoEncuestaById = response.filter((_) => (_.codigo == adminCodigo && _.codigo_cia == codigo_cia && _.identificador == identificador));
    if (tipoEncuestaById.length == 0) {
      return null;
    }
    return tipoEncuestaById[0];
});
