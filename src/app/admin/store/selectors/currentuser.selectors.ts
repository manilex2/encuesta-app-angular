import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CurrentUser } from '../../components/models';
import { currentUserFeatureKey } from '../reducers/currentuser.reducers';

export const selectCurrentUser = createFeatureSelector<CurrentUser>(currentUserFeatureKey);

export const currentUser = createSelector(
  selectCurrentUser,
  (selectCurrentUser) => selectCurrentUser
)
