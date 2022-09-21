import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Admin } from '../../components/models';
import { adminFeatureKey } from '../reducers/admin.reducers';

export const selectAdmins = createFeatureSelector<Admin[]>(adminFeatureKey);

export const admins = createSelector(
  selectAdmins,
  (selectAdmins) => selectAdmins
)
