import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminState, adminFeatureKey } from '../reducers/admin.reducers';

export const selectAdmins = createFeatureSelector<AdminState>(adminFeatureKey);

export const admins = createSelector(
  selectAdmins,
  (selectAdmins) => selectAdmins.admins
)
