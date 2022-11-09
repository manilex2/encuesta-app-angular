import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TiposEncuesta } from '../../components/models';
import { tiposEncuestaFeatureKey } from '../reducers/tiposencuesta.reducers';

export const selectTiposEncuesta = createFeatureSelector<TiposEncuesta[]>(tiposEncuestaFeatureKey);

export const tipos_encuesta = createSelector(
  selectTiposEncuesta,
  (selectTiposEncuesta) => selectTiposEncuesta
);

export const selectTipoEncuestaById = (adminCodigo: string, codigo_cia: string, identificador: string) =>
  createSelector(selectTiposEncuesta, (tipos_encuesta: TiposEncuesta[]) => {
    var tipoEncuestaById = tipos_encuesta.filter((_) => (_.codigo == adminCodigo && _.codigo_cia == codigo_cia && _.identificador == identificador));
    if (tipoEncuestaById.length == 0) {
      return null;
    }
    return tipoEncuestaById[0];
});
