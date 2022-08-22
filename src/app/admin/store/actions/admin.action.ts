import { createAction, props } from '@ngrx/store';
import { Admin } from '../../components/models/Admin';

export const adminGET = createAction(
  '[ADMINS] Consultando Admins'
);

export const adminGETSuccess = createAction(
  '[ADMINS] Admins traidos exitosamente',
  props<{ admins: Admin[] }>()
);
