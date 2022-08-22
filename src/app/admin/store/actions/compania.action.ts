import { createAction, props } from '@ngrx/store';
import { Compania } from '../../components/models/Compania';

export const companiasGET = createAction(
  '[COMPAÑÍAS get] Consultando Compañías'
);

export const companiasGETSuccess = createAction(
  '[COMPAÑÍAS success] Compañías traidas exitosamente',
  props<{ companias: Compania[] }>()
);
