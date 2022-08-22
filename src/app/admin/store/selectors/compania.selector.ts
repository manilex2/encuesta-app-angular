import { createFeatureSelector } from '@ngrx/store';
import { Compania } from '../../components/models/Compania';

export const selectCompanias = createFeatureSelector<Compania[]>('companias');
