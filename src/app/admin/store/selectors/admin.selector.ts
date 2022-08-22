import { createFeatureSelector } from '@ngrx/store';
import { Admin } from '../../components/models/Admin';

export const selectAdmins = createFeatureSelector<Admin[]>('admins');
