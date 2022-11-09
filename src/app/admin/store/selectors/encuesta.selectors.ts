import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Encuesta } from '../../components/models';
import { encuestaFeatureKey } from '../reducers/encuesta.reducers';

export const selectEncuesta = createFeatureSelector<Encuesta[]>(encuestaFeatureKey);

export const encuesta = createSelector(
  selectEncuesta,
  (selectEncuesta) => selectEncuesta
);

export const selectTipoEncuestaById = (adminCodigo: string, codigo_cia: string, identificador: string, numero: number) =>
  createSelector(selectEncuesta, (encuesta: Encuesta[]) => {
    var encuestaById = encuesta.filter((_) => (_.identificador == identificador && _.codigo == adminCodigo && _.codigo_cia == codigo_cia && _.numero == numero));
    if (encuestaById.length == 0) {
      return null;
    }
    return encuestaById[0];
});
