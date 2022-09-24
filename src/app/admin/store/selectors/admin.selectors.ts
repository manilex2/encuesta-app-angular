import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Admin } from '../../components/models';
import { adminFeatureKey } from '../reducers/admin.reducers';

export const selectAdmins = createFeatureSelector<Admin[]>(adminFeatureKey);

export const admins = createSelector(
  selectAdmins,
  (selectAdmins) => selectAdmins
)

export const selectAdminById = (adminCodigo: string) =>
  createSelector(selectAdmins, (admins: Admin[]) => {
    var adminById = admins.filter((_) => _.codigo == adminCodigo);
    if (adminById.length == 0) {
      return null;
    }
    return adminById[0];
});
