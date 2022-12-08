import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Client } from '../../components/models';
import { clientFeatureKey } from '../reducers/client.reducers';

export const selectClient = createFeatureSelector<Client[]>(clientFeatureKey);

export const client = createSelector(
  selectClient,
  (selectClient) => selectClient
);

export const selectTipoEncuestaById = (adminCodigo: string, codigo_cia: string) =>
  createSelector(selectClient, (client: Client[]) => {
    var clientById = client.filter((_) => (_.codigo == adminCodigo && _.codigo_cia == codigo_cia));
    if (clientById.length == 0) {
      return null;
    }
    return clientById[0];
});
